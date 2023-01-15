from django.urls import path
from apps.folder import views

urlpatterns = [
    path('', views.FolderViewSet.as_view({'get': 'list', 'post': 'create'}), name='folder'),
    path('<int:id>/', views.FolderViewSet.as_view({'get': 'retrieve', 'put': 'update'}), name='folder_detail'),

    path(
        '<int:id>/attachment/',
        views.FolderAttachmentViewSet.as_view({'get': 'list', 'post': 'create'}),
        name='folder_attachment'
    ),
    path(
        '<int:id_folder>/attachment/<int:id_attachment>',
        views.FolderAttachmentViewSet.as_view({'get': 'retrieve', 'put': 'update', 'delete': 'destroy'}),
        name='folder_attachment_detail'
    ),

    path(
        '<int:id_folder>/entity/<int:id_entity>/',
        views.FolderEntityViewSet.as_view({'put': 'update', 'delete': 'destroy'}),
        name='folder_entity_detail'
    ),
    path(
        '<int:id_folder>/entity/',
        views.FolderEntityViewSet.as_view({'post': 'create', 'delete': 'destroy'}),
        name='folder_entity'
    ),
]
