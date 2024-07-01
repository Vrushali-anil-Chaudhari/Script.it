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
        print("in upload to truffle")
        data_folder = os.path.join(settings.BASE_DIR, 'data', str(index_id))
        client = Trufflepig(settings.TRUFFLE_PIG_KEY)
        print(index_id)
        index = client.get_index(str(index_id))
        print("index",index)
        dir_list = os.listdir(data_folder)
        print(dir_list)
        total_files = len(dir_list)
        files_upload_response = []

        for i, file_name in enumerate(dir_list):
            file_path = os.path.join(data_folder, file_name)
            upload_response = index.upload(files=[
                {'document_path': file_path}
            ])
            files_upload_response.append(upload_response)
            print(upload_response)
            # Update task progress
            progress = int((i + 1) / total_files * 100)
            print("PROGRESSSSSSSS",progress)
            # if progress != 100:
            self.update_state(state='PROGRESS', meta={'progress': progress})
            # elif progress >= 99:
            #     self.update_state(state='PROGRESS', meta={'progress': 99})

        if progress >= 85:
              self.update_state(state='SUCCESS', meta={'progress': 99})

        return {'status': 'PROGRESS', 'files_upload_response': files_upload_response,'index': index_id}
   
    except Exception as ex: 
        print(ex)
        self.update_state( state='FAILURE', meta={ 'exc_type': type(ex).__name__, 'exc_message': traceback.format_exc().split('\n') }) 
        return {'status': 'FAILURE', 'files_upload_response': str(ex)}