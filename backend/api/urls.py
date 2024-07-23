from django.urls import path, re_path
from .views import  FileUploadView, TaskStatusView,GetResults, DeleteAll,GetUploadedFiles
from django.conf import settings
from django.conf.urls.static import static
from django.views.static import serve

urlpatterns = [
    
    path('upload/', FileUploadView.as_view(), name='file_upload'),
    path('task-status/<str:task_id>/', TaskStatusView.as_view(), name='task-status'),
    path('deleteall/', DeleteAll.as_view(), name='delete_all_files'),
    path('delete/<str:document_key>/', FileUploadView.as_view(), name='delete_single_file'),
    path('download/<str:document_key>/', FileUploadView.as_view(), name='get_single_file'),
    path('get_files/',GetResults.as_view(), name = 'get_files'),
    path('get_profile', GetResults.as_view(),name = 'get_profile'),
    path('get_uploaded_files' ,GetUploadedFiles.as_view(), name = 'get_uploaded_files'),
    re_path(r'^media/(?P<path>.*)$' , serve , {'document_root': settings.MEDIA_ROOT}),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL , document_root = settings.MEDIA_ROOT)