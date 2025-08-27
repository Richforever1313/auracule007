import json
from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer
from .models import ChatRoom, Message
from django.contrib.auth import get_user_model
from django.core.exceptions import ObjectDoesNotExist

User = get_user_model()

class ProfileChatConsumer(WebsocketConsumer):
    def connect(self):
        self.profile_id = self.scope['url_route']['kwargs']['profile_id']
        self.room_group_name = f'chat_{self.profile_id}'
        
        try:
            # Lazy import to avoid circular imports
            from bitcoin.models import Profile
            self.profile = Profile.objects.get(id=self.profile_id)
        except ObjectDoesNotExist:
            self.close()
            return
        
        # Join room group
        async_to_sync(self.channel_layer.group_add)(
            self.room_group_name,
            self.channel_name
        )
        
        self.accept()
        
        # Send connection status
        self.send_connection_status()
        
        # Update online status
        self.update_online_status(True)

    def disconnect(self, close_code):
        # Leave room group
        async_to_sync(self.channel_layer.group_discard)(
            self.room_group_name,
            self.channel_name
        )
        
        # Update online status
        self.update_online_status(False)

    def receive(self, text_data):
        try:
            data = json.loads(text_data)
            message_type = data.get('type')
            
            if message_type == 'chat_message':
                self.handle_chat_message(data)
            elif message_type == 'typing':
                self.handle_typing(data)
            elif message_type == 'connection_check':
                self.send_connection_status()
                
        except json.JSONDecodeError:
            self.send_error("Invalid JSON format")

    def handle_chat_message(self, data):
        message = data.get('message', '').strip()
        if not message:
            return self.send_error("Message cannot be empty")
        
        try:
            # Get or create chat room
            room, created = ChatRoom.objects.get_or_create(
                profile=self.profile,
                defaults={'room_name': self.room_group_name}
            )
            
            # Create message
            message_obj = Message.objects.create(
                room=room,
                sender_is_admin=data.get('is_admin', False),
                content=message
            )
            
            # Send message to room group
            async_to_sync(self.channel_layer.group_send)(
                self.room_group_name,
                {
                    'type': 'chat.message',
                    'message': message,
                    'is_admin': message_obj.sender_is_admin,
                    'message_id': message_obj.id,
                    'timestamp': message_obj.timestamp.isoformat(),
                    'sender': 'admin' if message_obj.sender_is_admin else 'user'
                }
            )
            
        except Exception as e:
            self.send_error(f"Error sending message: {str(e)}")

    def handle_typing(self, data):
        async_to_sync(self.channel_layer.group_send)(
            self.room_group_name,
            {
                'type': 'chat.typing',
                'is_typing': data.get('is_typing', False),
                'is_admin': data.get('is_admin', False)
            }
        )

    def update_online_status(self, online):
        self.profile.online = online
        self.profile.save()
        
        # Notify group about status change
        async_to_sync(self.channel_layer.group_send)(
            self.room_group_name,
            {
                'type': 'chat.status',
                'online': online
            }
        )

    def send_connection_status(self):
        # Check if admin is connected
        admin_connected = User.objects.filter(
            is_staff=True,
            is_active=True
        ).exists()
        
        self.send(text_data=json.dumps({
            'type': 'connection_status',
            'admin_connected': admin_connected
        }))

    def send_error(self, message):
        self.send(text_data=json.dumps({
            'type': 'error',
            'message': message
        }))

    # Handler methods for group events
    def chat_message(self, event):
        self.send(text_data=json.dumps({
            'type': 'chat_message',
            'message': event['message'],
            'is_admin': event['is_admin'],
            'message_id': event['message_id'],
            'timestamp': event['timestamp'],
            'sender': event['sender']
        }))

    def chat_typing(self, event):
        self.send(text_data=json.dumps({
            'type': 'typing',
            'is_typing': event['is_typing'],
            'is_admin': event['is_admin']
        }))

    def chat_status(self, event):
        self.send(text_data=json.dumps({
            'type': 'status_update',
            'online': event['online']
        }))