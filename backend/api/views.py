from django.contrib.auth import authenticate, login, logout
from django.http import JsonResponse
from django.middleware.csrf import get_token
from rest_framework.decorators import api_view
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Profile
from django.conf import settings
from trufflepig import Trufflepig
from celery.result import AsyncResult
from .tasks import upload_truffle_pig
import uuid
import os

@api_view(['POST'])
def login_view(request):
    username = request.data.get('username')
    password = request.data.get('password')
    print(username,password)
    user = authenticate(request, username=username, password=password)
    if user is not None:
        login(request, user)
        return JsonResponse({'success': True, 'csrfToken': get_token(request)})
    else:
        return JsonResponse({'success': False, 'error': 'Invalid credentials'}, status=400)

@api_view(['POST'])
def logout_view(request):
    logout(request)
    return JsonResponse({'success': True})

class GetCSRFToken(APIView):
    def get(self, request):
        token = get_token(request)
        return Response({'csrfToken': token})

class FileUploadView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        print("User",user)
        print("Truffle pig",settings.TRUFFLE_PIG_KEY)
        profile, created = Profile.objects.get_or_create(user=user)

        if not profile.index_id:
            profile.index_id = uuid.uuid4()
            profile.save()

        files = request.FILES.getlist('files')
        data_folder = os.path.join(settings.BASE_DIR, 'data')
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
        except:
                index_id = profile.index_id
                index = client.get_index(str(index_id))
        # print("indexid in views", index_id)
        task_result = upload_truffle_pig.delay(index_id)

        return Response({'task_id': task_result.id, 'message': 'File upload task queued.'})


class TaskStatusView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, task_id):
        task_result = AsyncResult(task_id)

        response = {
            'state': task_result.status,
            'progress': 0,
            'result': None,
        }

        if task_result.state == 'PENDING':
            response['progress'] = 0
        elif task_result.state == 'PROGRESS':
            response['progress'] = task_result.info.get('progress', 0)
        elif task_result.state == 'SUCCESS':
            response['progress'] = 100
            user = request.user
            profile, created = Profile.objects.get_or_create(user=user)
            index_id = profile.index_id
            client = Trufflepig(settings.TRUFFLE_PIG_KEY)
            index = client.get_index(str(index_id))
            data_folder = os.path.join(settings.BASE_DIR, 'data')
            dir_list = os.listdir(data_folder)
            files_key = []
            for i, file_name in enumerate(dir_list):
                files_key.append(file_name)
            job_tracking_response = index.get_upload_status(files_key)
           
            result = {}
            for i,status in enumerate(job_tracking_response):
                result[i] = {"document_key": status.document_key, "job_status":status.job_status}
            print("Result",result )
            response['result'] = result
        elif task_result.state == 'FAILURE':
            response['progress'] = 0
            response['result'] = {
                'exc_type': task_result.info.get('exc_type'),
                'exc_message': task_result.info.get('exc_message'),
            }
        return Response(response)
