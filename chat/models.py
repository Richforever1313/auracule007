from django.db import models
from bitcoin.models import Profile

from django.contrib.auth import get_user_model

User = get_user_model()
# Create your models here.

class ChatRoom(models.Model):
    profile = models.ForeignKey(Profile, on_delete=models.CASCADE, related_name='chat_rooms')
    room_name = models.CharField(max_length=255, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f"Chat with {self.profile}"

class Message(models.Model):
    room = models.ForeignKey(ChatRoom, on_delete=models.CASCADE, related_name='messages')
    sender_is_admin = models.BooleanField(default=False)
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)
    read = models.BooleanField(default=False)

    class Meta:
        ordering = ('timestamp',)

    def __str__(self):
        sender = "Admin" if self.sender_is_admin else "User"
        return f"{sender}: {self.content[:20]}..."