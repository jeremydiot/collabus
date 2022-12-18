from rest_framework import viewsets
from rest_framework.exceptions import NotFound
from rest_framework.response import Response
from rest_framework.status import HTTP_400_BAD_REQUEST, HTTP_201_CREATED, HTTP_403_FORBIDDEN

from drf_spectacular.utils import extend_schema

from apps.main.permissions import HasCompanyEntity, HasEntityFolderAuthor, IsAuthenticated, HasEntityFolderAssigned
from apps.main.utils import request_params_to_queryset, drf_params_schema
from apps.folder.models import Folder, FolderEntity
from apps.folder.serializers import FolderSerializerFull, FolderSerializerPartial


class FolderViewSet (viewsets.ViewSet):

    def get_permissions(self):
        self.permission_classes = [IsAuthenticated]

        if self.action in ['list']:
            self.permission_classes = [IsAuthenticated]

        if self.action in ['retrieve']:
            self.permission_classes = [HasEntityFolderAssigned]

        if self.action in ['update']:
            self.permission_classes = [HasEntityFolderAuthor]

        if self.action == 'create':
            self.permission_classes = [HasCompanyEntity]

        return super().get_permissions()

    def get_object(self, pk, extra=None):
        try:
            return Folder.objects.get(pk=pk, **(extra if extra else {}))
        except Folder.DoesNotExist as exc:
            raise NotFound from exc

    @extend_schema(request=FolderSerializerFull, responses=FolderSerializerFull, summary='Get folder')
    def retrieve(self, request, pk):
        return Response(FolderSerializerFull(self.get_object(pk)).data)

    @extend_schema(
        parameters=drf_params_schema(
            FolderSerializerPartial.Meta.fields,
            True,
            {
                'deadline': 'Date: YYYY-MM-DD',
                'entity': 'Entity primary key',
                'is_closed': 'Default: False',
                'is_hidden': 'Default: False',
                'type': 'Integer choices: ' + str(Folder.Type.choices)
            }),
        responses=FolderSerializerPartial, summary='List folders')
    def list(self, request):
        serializer = FolderSerializerPartial(
            request_params_to_queryset(
                request.GET, Folder.objects.all(),
                {
                    'entity': 'folderentity__entity__pk'
                }
            ).exclude(is_hidden=True, is_close=True), many=True
        )
        return Response(serializer.data)

    @extend_schema(request=FolderSerializerPartial, responses=FolderSerializerPartial, summary='Create folder')
    def create(self, request):
        folder = Folder()
        user_entity = getattr(self.request.user, 'entity', None)

        if user_entity is None:
            return Response(status=HTTP_403_FORBIDDEN)

        serializer = FolderSerializerPartial(folder, data=request.data)
        if serializer.is_valid():
            folder = serializer.save()
            FolderEntity(folder=folder, entity=user_entity, is_author=True).save()
            return Response(FolderSerializerPartial(folder).data, status=HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=HTTP_400_BAD_REQUEST)

    @extend_schema(request=FolderSerializerPartial, responses=FolderSerializerPartial, summary='Update folder')
    def update(self, request, pk):
        user_entity = getattr(self.request.user, 'entity', None)

        if user_entity is None:
            return Response(status=HTTP_403_FORBIDDEN)

        folder = self.get_object(pk, {'folderentity__entity__pk': user_entity.pk})

        serializer = FolderSerializerPartial(folder, data=request.data, partial=True)

        if serializer.is_valid():
            folder = serializer.save()
            return Response(FolderSerializerPartial(folder).data, status=HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=HTTP_400_BAD_REQUEST)
