
from django.urls import path
from django.conf import settings
from apps.websocket import views

urlpatterns = [
    *([
        path('view/chat/<str:kind>/<str:pk>/', views.ChatView.as_view(), name='websocket_chat_view'),
    ]if settings.EXECUTION_ENVIRONMENT in ['development', 'staging'] else []),
]
