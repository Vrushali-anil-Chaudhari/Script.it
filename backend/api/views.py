from rest_framework.permissions import IsAuthenticated,AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from django.conf import settings
from trufflepig import Trufflepig
from celery.result import AsyncResult
from .tasks import upload_truffle_pig
import os
from rest_framework import status
from django.http import Http404, HttpResponse
import nest_asyncio
from rest_framework.permissions import AllowAny
from django.contrib.auth.models import User
from authenticate.models import CustomUser
from llama_parse import LlamaParse
import shutil
import time
from api.utils import remove_stopwords,most_repeated_words
nest_asyncio.apply()



# class LogoutView(APIView):
#     def post(self, request, *args, **kwargs):
#         logout(request)
#         return Response({
#             'message': 'Logout successful'
#         }, status=status.HTTP_200_OK)
    

class FileUploadView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        current_user = request.user
        
        print("User",current_user)
        print("Truffle pig",settings.TRUFFLE_PIG_KEY)
        # profile, created = User.objects.get_or_create(current_user)
        try:
            profile = CustomUser.objects.get(username=current_user.username, email=current_user.email)
        except CustomUser.DoesNotExist:
            return Response({'error': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)

        
        index_id = profile.index_id
        print(index_id)
        files = request.FILES.getlist('files')
        data_folder = os.path.join(settings.MEDIA_ROOT, str(index_id))
        if not os.path.exists(data_folder):
            os.makedirs(data_folder)
      
        for file in files:
            file_path = os.path.join(data_folder, file.name)
            with open(file_path, 'wb+') as destination:
                for chunk in file.chunks():
                    destination.write(chunk)
        
        client = Trufflepig(settings.TRUFFLE_PIG_KEY)
        try: 
                index_id = profile.index_id
                index = client.create_index(str(index_id))
                print("index created", index_id)
        except Exception as e:
                index_id = profile.index_id
                index = client.get_index(str(index_id))
                print("index get", index_id,index,e)
                if index == None:
                    return Response({"message": "Try Again"})
        # print("indexid in views", index_id)
        task_result = upload_truffle_pig.delay(index_id)

        return Response({'task_id': task_result.id, 'message': 'File upload task queued.'})
    
    
    

    def delete(self,request, document_key):
        current_user = request.user
        try:
         profile = CustomUser.objects.get(username=current_user.username, email=current_user.email)
        except CustomUser.DoesNotExist:
            return Response({'error': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)
        client = Trufflepig(settings.TRUFFLE_PIG_KEY)
        index_id = profile.index_id
        
        try:
            
            index = client.get_index(str(index_id))
            print(index)
           
            delete_response = index.delete_documents([str(document_key)])
            print("delteeee",delete_response)
        except Exception as e:
            print(e)
            return Response({'error': str(e)}, status= status.HTTP_500_INTERNAL_SERVER_ERROR)
        filepath = os.path.join(settings.MEDIA_ROOT, str(index_id),document_key)
        os.remove(filepath)
        return Response({'status': delete_response,'message':"Single file deleted"}) 

    def get(self, request, document_key):
        current_user = request.user
        try:
            profile = CustomUser.objects.get(username=current_user.username, email=current_user.email)
        except CustomUser.DoesNotExist:
            return Response({'error': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)
        
        index_id = profile.index_id
        
        filepath = os.path.join(settings.MEDIA_ROOT, str(index_id), document_key)

        if not os.path.isfile(filepath):
            raise Http404("File does not exist")

        try:
            parser = LlamaParse(
                api_key= settings.LLAMA_KEY,  # can also be set in your env as LLAMA_CLOUD_API_KEY
                result_type="text",  # "markdown" and "text" are available
                num_workers=6,  # if multiple files passed, split in `num_workers` API calls
                verbose=True,
                language="en",  # Optionally you can define a language, default=en
                skip_diagonal_text=True,
                fast_mode=True 
            )
            
            documents = parser.load_data(filepath)
            print("parsing done")
            # Create an HttpResponse with the file content
            response = {}
            response['text'] = documents[0].text.replace('---',"\n")
            response['message'] = 'Content Received'
            # print(response)
            return Response(response)

        except Exception as e:
            return HttpResponse(f'Error reading file: {str(e)}', status=500)


class DeleteAll(APIView):
    permission_classes= [IsAuthenticated]    

    def delete(self,request):
        current_user = request.user
        try:
         profile = CustomUser.objects.get(username=current_user.username, email=current_user.email)
        except CustomUser.DoesNotExist:
            return Response({'error': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)
        client = Trufflepig(settings.TRUFFLE_PIG_KEY)
        index_id = profile.index_id
        print(index_id)
        index = client.get_index(str(index_id))
        indexes = client.list_indexes()
        print(indexes) 
        try:
            delete_response = client.delete_index(str(index_id))
        except Exception as e:
            return Response({'error': str(e)}, status= status.HTTP_500_INTERNAL_SERVER_ERROR)
        directory = os.path.join(settings.MEDIA_ROOT,str(index_id))
        shutil.rmtree(directory)
        return Response({'status': delete_response,"message":'All files cleared'}) 
    

class GetResults(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        query = request.data.get('query')
        query = remove_stopwords(query)
        print("query", query)
        current_user = request.user
        try:
         profile = CustomUser.objects.get(username=current_user.username, email=current_user.email)
        except CustomUser.DoesNotExist:
            return Response({'error': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)
        client = Trufflepig(settings.TRUFFLE_PIG_KEY)
        index_id = profile.index_id
        index = client.get_index(str(index_id))
        # print(index)
        search_response = index.search(query_text= query)
       
        # print(f'Got result: {search_response} ')
        if len(search_response) == 0:
            return Response({"total_results": len(search_response),"message" : "Document not found"})
        else:
            # total_result = []
            # document_key = []
            # for i in range(len(search_response)):
            #     keywords = {}
            #     if search_response[i].document_key not in document_key:
            #         data= {}
            #         data["data"] = search_response[i].content
            #         data["document_key"] = search_response[i].document_key
            #         keywords[str(search_response[i].document_key)] = [search_response[i].content]
            #         document_key.append(search_response[i].document_key)
            #         total_result.append(data)
            #     else:
            #         keywords[str(search_response[i].document_key)] = [search_response[i].content]
            total_result = []
            document_key_map = {}  # Dictionary to map document_key to their respective data lists
            repeated_word = ""
            for response in search_response:
                document_key = response.document_key
                content = response.content
                repeated_word = repeated_word + " " + str(content)
                if document_key not in document_key_map:
                    # Create a new entry for a unique document_key
                    document_key_map[document_key] = {
                        
                        "document_key": document_key
                    }
                
            print(repeated_word)
            highlighted_words = most_repeated_words(repeated_word, query)
            print(highlighted_words)
            for key in document_key_map:
             document_key_map[key]['data'] = highlighted_words
            total_result = list(document_key_map.values()) 
            print(total_result,len(search_response))   
            return Response({"total_results": len(total_result),"results":total_result,"message":"Results received"}) 

    def get(self,request):
        current_user = request.user
        return Response({"data" : {"username": current_user.username , "email": current_user.email , "first_name": current_user.first_name}})
            
class GetUploadedFiles(APIView):
    permission_classes = [IsAuthenticated]

    def get(self,request):
        current_user = request.user
        try:
         profile = CustomUser.objects.get(username=current_user.username, email=current_user.email)
        except CustomUser.DoesNotExist:
            return Response({'error': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)
        client = Trufflepig(settings.TRUFFLE_PIG_KEY)
        index_id = profile.index_id
        print(index_id)
        
        index = client.get_index(str(index_id))
        if index == None:
            return Response({"error": "No files"})
        documents = index.list_documents()
        return Response({"files":documents})





class TaskStatusView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, task_id):
        try:
            task_result = AsyncResult(task_id)
            print(task_result.status, task_result.info.get('progress'))
            response = {
                'state': task_result.status,
                'progress': task_result.info.get('progress', 0),
                'result': None,
                'message': 'File Upload In progress'
            }
            # print(response)
            if task_result.state == 'PENDING':
                response['progress'] = 0
            elif task_result.state == 'PROGRESS':
                response['progress'] = task_result.info.get('progress', 0)
            elif task_result.state == 'SUCCESS':
                if task_result.info.get('progress', 0) == 99:
                    response['result'] = None
                    response['progress'] = 99
                    response['state'] = 'IN_PROGRESS'
                    response['message'] = 'File Upload In progress'
                    current_user = request.user
                    try:
                        profile = CustomUser.objects.get(username=current_user.username, email=current_user.email)
                    except CustomUser.DoesNotExist:
                        return Response({'error': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)
                    index_id = profile.index_id
                    client = Trufflepig(settings.TRUFFLE_PIG_KEY)
                    index = client.get_index(str(index_id))
                    data_folder = os.path.join(settings.MEDIA_ROOT, str(index_id))
                    dir_list = os.listdir(data_folder)
                    files_key = []
                    for i, file_name in enumerate(dir_list):
                        files_key.append(file_name)
                    print(index, index_id)
                    job_tracking_response = index.get_upload_status(files_key)
                    print(job_tracking_response)
                    result = {}
                    count = 0
                    for i, status in enumerate(job_tracking_response):
                        result[i] = {"document_key": status.document_key, "job_status": status.job_status}
                        print(status.job_status)
                        if str(status.job_status) == "SUCCESS" or str(status.job_status) == "FAILED":
                            count += 1
                       
                    print("COUNTT", count)
                    if count == len(job_tracking_response):
                        response['result'] = result
                        response['progress'] = 100
                        response['state'] = 'SUCCESS'
                        response['message'] = 'File Upload Completed'
                    else:
                        response['result'] = result
                        response['progress'] = 99
                        response['state'] = 'IN_PROGRESS'
                        response['message'] = 'File Upload In progress'
                elif task_result.info.get('progress', -1) == -1:
                    response['state'] = 'FAILED'
                    response['progress'] = 0
                    response['result'] = {
                        'exc_type': task_result.info.get('exc_type'),
                        'exc_message': task_result.info.get('exc_message'),
                    }
                    response['message'] = 'File Upload Failed'
            return Response(response)
        except Exception as e:
            return Response({"error": str(e)})
