
from django.views import View
from django.shortcuts import render
from django.conf import settings


class ChatView(View):
    def get(self, request, kind, pk):
        return render(
            request,
            'websocket/chat.html',
            {
                'chat_kind': kind,
                'chat_pk': pk,
                'ws_url': settings.WEBSOCKET_CHAT_URL
            }
        )
