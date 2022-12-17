from rest_framework import viewsets
from rest_framework.exceptions import NotFound
from rest_framework.response import Response
from drf_spectacular.utils import extend_schema

from apps.main.permissions import AllowAny
from apps.folder.models import Folder
from apps.folder.serializers import FolderSerializer


class FolderViewSet (viewsets.ViewSet):

    # TODO add permissions
    def get_permissions(self):
        self.permission_classes = [AllowAny]
        if self.action in ['retrieve', 'update', 'destroy', 'list']:
            self.permission_classes = [AllowAny]
        if self.action == 'create':
            self.permission_classes = [AllowAny]
        return super().get_permissions()

    def get_object(self, pk):
        try:
            return Folder.objects.get(pk=pk)
        except Folder.DoesNotExist as exc:
            raise NotFound from exc

    @extend_schema(request=FolderSerializer, responses=FolderSerializer, summary='Get folder')
    def retrieve(self, request, pk):
        return Response(FolderSerializer(self.get_object(pk)).data)
