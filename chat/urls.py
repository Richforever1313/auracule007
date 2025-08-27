from django.urls import path
from . import views

urlpatterns = [
    path('admin/chat/<int:profile_id>/', views.admin_chat, name='admin_chat'),
    path('client_chat/', views.client_chat, name='client_chat'),
    path('api/chat/<int:profile_id>/messages/', views.get_messages, name='get_messages'),
    path('api/chat/messages/<int:message_id>/read/', views.mark_as_read, name='mark_as_read'),
]