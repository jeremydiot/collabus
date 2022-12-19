from django.conf import settings
from django.urls import path
from apps.websocket import consumers

websocket_urlpatterns = [
    path(
        f'{settings.WEBSOCKET_CHAT_URL}<str:kind>/<str:pk>/',
        consumers.AsyncChatConsumer.as_asgi(),
        name='websocket_chat_consumer'
    )
]
