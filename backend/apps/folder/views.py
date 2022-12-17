from rest_framework import viewsets
from rest_framework.exceptions import NotFound
from rest_framework.response import Response

from drf_spectacular.utils import extend_schema

from apps.main.permissions import AllowAny
from apps.main.utils import request_params_to_queryset, drf_params_schema
from apps.folder.models import Folder
from apps.folder.serializers import FolderSerializer, FolderSerializerList


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

    @extend_schema(
        parameters=drf_params_schema(
            FolderSerializerList.Meta.fields,
            True,
            {
                'deadline': 'Date: YYYY-MM-DD',
                'entity': 'Entity primary key',
                'is_closed': 'Default: False',
                'is_hidden': 'Default: False',
                'type': 'Integer choices: ' + str(Folder.Type.choices)
            }),
        responses=FolderSerializerList, summary='List folders')
    def list(self, request):
        serializer = FolderSerializerList(
            request_params_to_queryset(
                request.GET, Folder.objects.all(),
                {
                    'entity': 'folderentity__entity__pk'
                }
            ), many=True
        )
        return Response(serializer.data)
