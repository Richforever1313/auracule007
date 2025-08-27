# Register your models here.
from django.urls import reverse
from django.utils.html import format_html
from django.contrib import admin
from .models import Profile, Wallet  # Import your Profile model

@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = ("id", "fullName", "email", "chat_button")  # Add chat_button to list_display if you want it in list view
    search_fields = ("fullName", "email")

    def chat_button(self, obj):
        return format_html(
            '<a class="button" href="{}">Chat</a>',
            reverse('admin_chat', args=[obj.id])
        )
    chat_button.short_description = 'Chat'
    chat_button.allow_tags = True
admin.site.register(Wallet)