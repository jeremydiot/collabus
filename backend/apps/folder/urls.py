from django.urls import path
from apps.folder import views

urlpatterns = [
    path('', views.FolderViewSet.as_view({'get': 'list'}), name='folder'),

    path(
        '<int:id_folder>/attachment/',
        views.FolderAttachmentViewSet.as_view({'get': 'list', 'post': 'create'}),
        name='folder_attachment'
    ),
    path(
        '<int:id_folder>/attachment/<int:id_attachment>',
        views.FolderAttachmentViewSet.as_view({'put': 'update', 'delete': 'destroy'}),
        name='folder_attachment_detail'
    ),

    path(
        '<int:id_folder>/entity/<int:id_entity>/',
        views.FolderEntityAuthorViewSet.as_view({'put': 'update', 'delete': 'destroy'}),
        name='folder_entity_author'
    ),
    path(
        '<int:id_folder>/entity/',
        views.FolderEntityContributorViewSet.as_view({'post': 'create', 'delete': 'destroy'}),
        name='folder_entity_contibutor'
    ),
    path(
        'entity/',
        views.FolderEntityContributorViewSet.as_view({'get': 'list'}),
        name='folder_entity_list'
    ),
]
