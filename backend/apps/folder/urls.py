from django.urls import path
from apps.folder import views

urlpatterns = [
    path('<int:pk>/', views.FolderViewSet.as_view({'get': 'retrieve'}), name='folder'),
]
