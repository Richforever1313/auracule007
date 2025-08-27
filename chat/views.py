from django.shortcuts import render, get_object_or_404
from django.http import JsonResponse
from django.contrib.auth.decorators import login_required, user_passes_test
from bitcoin.models import Profile
from .models import ChatRoom, Message
import json

@login_required
@user_passes_test(lambda u: u.is_staff)
def admin_chat(request, profile_id):
    profile = get_object_or_404(Profile, id=profile_id)
    chat_room, created = ChatRoom.objects.get_or_create(
        profile=profile,
        defaults={'room_name': f'chat_{profile_id}'}
    )
    
    if created:
        Message.objects.create(
            room=chat_room,
            sender_is_admin=True,
            content="Hello! How can I help you today?"
        )
    
    return render(request, 'admin_chat.html', {
        'profile': profile,
        'all_profiles': Profile.objects.all(),
        'room_name': chat_room.room_name
    })

def client_chat(request):
    if not (profile_id := request.session.get('active_profile_id')):
        return JsonResponse({'error': 'No active profile'}, status=400)
    
    profile = get_object_or_404(Profile, id=profile_id)
    chat_room, created = ChatRoom.objects.get_or_create(
        profile=profile,
        defaults={'room_name': f'chat_{profile_id}'}
    )
    
    return render(request, 'client_chat.html', {
        'profile': profile,
        'room_name': chat_room.room_name
    })

@login_required
def get_messages(request, profile_id):
    try:
        room = ChatRoom.objects.get(profile_id=profile_id)
        messages = room.messages.all().order_by('timestamp')
        return JsonResponse([{
            'id': m.id,
            'content': m.content,
            'is_admin': m.sender_is_admin,
            'timestamp': m.timestamp.isoformat(),
            'read': m.read
        } for m in messages], safe=False)
    except ChatRoom.DoesNotExist:
        return JsonResponse([], safe=False)

@login_required
def mark_as_read(request, message_id):
    try:
        message = Message.objects.get(id=message_id)
        message.read = True
        message.save()
        return JsonResponse({'status': 'success'})
    except Message.DoesNotExist:
        return JsonResponse({'status': 'error'}, status=404)