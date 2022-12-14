from django.urls import path
from apps.folder import views

urlpatterns = [
    path('<int:pk>/', views.FolderViewSet.as_view({'get': 'retrieve', 'put': 'update'}), name='folder_pk'),
    path('', views.FolderViewSet.as_view({'get': 'list', 'post': 'create'}), name='folder'),
    path('<int:pk>/entity/<int:fk>/',
         views.FolderEntityViewSet.as_view(
             {'post': 'create', 'delete': 'destroy'}
         ),
         name='folder_pk_entity_fk'),
]
