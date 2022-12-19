
from django.urls import path
from apps.websocket import views

urlpatterns = [
    path('view/chat/<str:kind>/<str:pk>/', views.ChatView.as_view(), name='websocket_chat_view'),
]
