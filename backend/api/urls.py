from django.urls import path
from .views import login_view, logout_view, GetCSRFToken, FileUploadView, TaskStatusView

urlpatterns = [
    path('login/', login_view, name='login'),
    path('logout/', logout_view, name='logout'),
    path('csrf_token/', GetCSRFToken.as_view(), name='csrf_token'),
    path('upload/', FileUploadView.as_view(), name='file_upload'),
    path('task-status/<str:task_id>/', TaskStatusView.as_view(), name='task-status'),

]