
from celery import shared_task, states
from django.conf import settings
from trufflepig import Trufflepig
from celery.exceptions import Ignore
import uuid
import os
import traceback



@shared_task(bind=True)
def upload_truffle_pig(self, index_id):
    try:
        print("Starting upload_truffle_pig task")
        data_folder = os.path.join(settings.MEDIA_ROOT, str(index_id))
        client = Trufflepig(settings.TRUFFLE_PIG_KEY)
        print(f"Index ID: {index_id}")
        
        index = client.get_index(str(index_id))
        print("Fetched index:", index)
        
        dir_list = os.listdir(data_folder)
        print("Files in directory:", dir_list)
        
        total_files = len(dir_list)
        files_upload_response = []
        progress = 0
        documents = index.list_documents()
        print("Existing documents:", documents)

        for i, file_name in enumerate(dir_list):
            if file_name not in documents:
                file_path = os.path.join(data_folder, file_name)
                try:
                    upload_response = index.upload(files=[{'document_path': file_path}])
                    files_upload_response.append(upload_response)
                    print(f"Uploaded {file_name} response:", upload_response)
                    
                    progress = int((i + 1) / total_files * 100)
                    print(f"Upload progress: {progress}%")
                    self.update_state(state='PROGRESS', meta={'progress': progress})
                except Exception as ex:
                    print(f"Error uploading {file_name}: {ex}")
                    self.update_state(state='FAILED', meta={
                        'exc_type': type(ex).__name__,
                        'exc_message': traceback.format_exc().split('\n'),
                        'progress': -1
                    })
                    return {'status': 'FAILED', 'files_upload_response': str(ex), 'index': index_id}

        # Ensure final state update
        self.update_state(state='PROGRESS', meta={'progress': 99})
        return {'status': 'PROGRESS', 'files_upload_response': files_upload_response, 'index': index_id, 'progress': 99}

    except Exception as ex:
        print("Exception occurred during task execution:", ex)
        print(traceback.format_exc())
        self.update_state(state='FAILED', meta={
            'exc_type': type(ex).__name__,
            'exc_message': traceback.format_exc().split('\n'),
            'progress': -1
        })
        return {'status': 'FAILED', 'files_upload_response': str(ex), 'index': index_id}