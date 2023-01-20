from rest_framework import viewsets
from rest_framework.exceptions import NotFound, ParseError, PermissionDenied, ValidationError
from rest_framework.response import Response
from rest_framework.status import HTTP_400_BAD_REQUEST, HTTP_201_CREATED, HTTP_204_NO_CONTENT
from rest_framework.parsers import MultiPartParser

from drf_spectacular.utils import extend_schema

from apps.main.permissions import HasCompanyEntity, HasSchoolEntity, HasEntityAssociatedToFolder, IsEntityStaff
from apps.main.utils import request_params_to_queryset, schema_parameters_builder
from apps.main.models import Entity
from apps.folder.models import Folder, Attachment, FolderEntity
from apps.folder.serializers import FolderPublicSerializer, AttachmentSerializer, FolderEntitySerializerDetailFolder


class FolderViewSet (viewsets.ViewSet):

    def get_permissions(self):
        if self.action == 'list':
            self.permission_classes = [HasSchoolEntity | HasCompanyEntity]

        return super().get_permissions()

    @extend_schema(parameters=schema_parameters_builder(
        fields=FolderPublicSerializer.Meta.fields,
        schema_list=True,
        description={
            'deadline': 'Date: YYYY-MM-DD - YYYY-MM-DD',
            'kind': 'Aviable integers: ' + str(Folder.Kind.choices)
        }
    ), responses=FolderPublicSerializer, summary='Get public folder list')
    def list(self, request):
        # TODO exclude folder with company accepted and school accepted
        try:
            queryset = request_params_to_queryset(
                params=request.GET,
                queryset=Folder.objects.all(
                ).exclude(
                    is_closed=True
                ).exclude(
                    is_hidden=True
                ).exclude(
                    is_verified=False
                ),
                authorized_keys=FolderPublicSerializer.Meta.fields,
                custom_method={
                    'deadline': 'range'
                }
            )
        except Exception as exc:
            raise ParseError from exc

        serializer = FolderPublicSerializer(
            queryset,
            many=True
        )
        return Response(serializer.data)


class FolderAttachmentViewSet (viewsets.ViewSet):

    parser_classes = (MultiPartParser,)

    def get_permissions(self):
        if self.action in ['list', 'create', 'update', 'destroy']:
            self.permission_classes = [(HasCompanyEntity | HasSchoolEntity) & HasEntityAssociatedToFolder]
        return super().get_permissions()

    def get_object(self, id_folder):
        try:
            return Folder.objects.get(pk=id_folder)
        except Folder.DoesNotExist as exc:
            raise NotFound from exc

    @extend_schema(parameters=schema_parameters_builder(
        fields=AttachmentSerializer.Meta.fields,
        schema_list=True, description={
            'created_at': 'Date: YYYY-MM-DD - YYYY-MM-DD',
            'updated_at': 'Date: YYYY-MM-DD - YYYY-MM-DD',
        }
    ), responses=AttachmentSerializer, summary='Get folder attachments list', tags=['folder attachment'])
    def list(self, request, id_folder):
        folder = self.get_object(id_folder)

        if request.user.entity.kind != Entity.Kind.COMPANY:
            if bool(folder.is_hidden or not folder.is_verified):
                raise PermissionDenied

        queryset = request_params_to_queryset(
            params=request.GET,
            queryset=folder.attachment_set.all(),
            authorized_keys=AttachmentSerializer.Meta.fields,
            custom_method={
                'created_at': 'range',
                'updated_at': 'range'
            }
        )

        return Response(AttachmentSerializer(queryset, many=True).data)

    # TODO limit size
    @extend_schema(request=AttachmentSerializer, responses=AttachmentSerializer,
                   summary='Add attachment in folder', tags=['folder attachment'])
    def create(self, request, id_folder):
        folder = self.get_object(id_folder)

        if request.user.entity.kind != Entity.Kind.COMPANY:
            if bool(folder.is_closed or folder.is_hidden or not folder.is_verified):
                raise PermissionDenied

        _data = {**request.data}
        _data['folder'] = str(id_folder)
        _data = {
            k: v[0] if isinstance(v, list) else v
            for k, v in _data.items()
            if v and ((isinstance(v, list) and v[0]) or (isinstance(v, str) and v))
        }

        if 'file' not in _data or 'folder' not in _data:
            raise ValidationError

        serializer = AttachmentSerializer(data=_data)

        if serializer.is_valid():
            attachment = serializer.save()
            return Response(AttachmentSerializer(attachment).data, status=HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=HTTP_400_BAD_REQUEST)

    # TODO limit size
    @extend_schema(request=AttachmentSerializer, responses=AttachmentSerializer,
                   summary='Update folder attachment', tags=['folder attachment'])
    def update(self, request, id_folder, id_attachment):
        folder = self.get_object(id_folder)

        if request.user.entity.kind != Entity.Kind.COMPANY:
            if bool(folder.is_closed or folder.is_hidden or not folder.is_verified):
                raise PermissionDenied

        try:
            attachment = Attachment.objects.get(id=id_attachment, folder=folder)
        except Attachment.DoesNotExist as exc:
            raise NotFound from exc

        _data = {**request.data}
        _data['folder'] = str(id_folder)
        _data = {
            k: v[0] if isinstance(v, list) else v
            for k, v in _data.items()
            if v and ((isinstance(v, list) and v[0]) or (isinstance(v, str) and v))
        }

        if 'folder' not in _data:
            raise ValidationError

        serializer = AttachmentSerializer(attachment, data=_data, partial=True)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=HTTP_400_BAD_REQUEST)

    @extend_schema(request=None, responses=None, summary='Delete folder attachment', tags=['folder attachment'])
    def destroy(self, request, id_folder, id_attachment):
        folder = self.get_object(id_folder)

        if request.user.entity.kind != Entity.Kind.COMPANY:
            if bool(folder.is_closed or folder.is_hidden or not folder.is_verified):
                raise PermissionDenied

        try:
            Attachment.objects.get(pk=id_attachment, folder=folder).delete()
        except Attachment.DoesNotExist as exc:
            raise NotFound from exc

        return Response(status=HTTP_204_NO_CONTENT)


# TODO prevent create already existed relation
class FolderEntityContributorViewSet (viewsets.ViewSet):

    def get_permissions(self):
        if self.action == 'list':
            self.permission_classes = [HasCompanyEntity | HasSchoolEntity]

        if self.action == 'create':
            self.permission_classes = [HasSchoolEntity & IsEntityStaff]

        if self.action == 'destroy':
            self.permission_classes = [HasSchoolEntity & IsEntityStaff]

        return super().get_permissions()

    def get_object(self, id_folder):
        try:
            return Folder.objects.get(pk=id_folder)
        except Folder.DoesNotExist as exc:
            raise NotFound from exc

    # TODO get list of associated entityfolder with public folder data, add custom params
    @extend_schema(request=schema_parameters_builder(
        fields=FolderEntitySerializerDetailFolder.Meta.fields,
        schema_list=True,
        description={
            'created_at': 'Date: YYYY-MM-DD - YYYY-MM-DD',
            'updated_at': 'Date: YYYY-MM-DD - YYYY-MM-DD',
        }
    ), responses=FolderEntitySerializerDetailFolder, summary='Get associated folder list', tags=['folder entity'])
    def list(self, request):

        queryset = FolderEntity.objects.filter(entity=request.user.entity)

        try:
            queryset = request_params_to_queryset(
                params=request.GET,
                queryset=queryset,
                authorized_keys=FolderEntitySerializerDetailFolder.Meta.fields,
                custom_keyword={
                    'created_at': 'range',
                    'updated_at': 'range'
                }
            )
        except Exception as exc:
            raise ParseError from exc

        serializer = FolderEntitySerializerDetailFolder(queryset, many=True)

        return Response(serializer.data)

    # TODO create entityfolder with public folder data
    # TODO restrict for folder with two entity enabled association, and already existed relation
    @extend_schema(request=None, responses=FolderEntitySerializerDetailFolder,
                   summary='Create folder association', tags=['folder entity contributor'])
    def create(self, request, id_folder):
        folder = self.get_object(id_folder)
        if bool(folder.is_closed or folder.is_hidden or not folder.is_verified):
            raise PermissionDenied

        serializer = FolderEntitySerializerDetailFolder(data={
            'folder': str(id_folder),
            'is_author': str(False),
            'is_accepted': str(False),
            'entity': str(request.user.entity.pk)
        })

        if serializer.is_valid():
            folder_entity = serializer.save()
            return Response(FolderEntitySerializerDetailFolder(folder_entity).data, status=HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=HTTP_400_BAD_REQUEST)

    # TODO deleted entity folder association
    @extend_schema(request=None, responses=None, summary='Delete folder association',
                   tags=['folder entity contributor'])
    def destroy(self, request, id_folder):
        folder = self.get_object(id_folder)

        try:
            FolderEntity.objects.get(folder=folder, entity=request.user.entity).delete()
        except FolderEntity.DoesNotExist as exc:
            raise NotFound from exc

        return Response(status=HTTP_204_NO_CONTENT)


# TODO prevent delete author, only author
class FolderEntityAuthorViewSet (viewsets.ViewSet):

    def get_permissions(self):
        if self.action in ['update', 'destroy']:
            self.permission_classes = [HasCompanyEntity & HasEntityAssociatedToFolder & IsEntityStaff]
        return super().get_permissions()

    def get_object(self, id_folder, id_entity, user_entity):
        try:
            return FolderEntity.objects.filter(
                folder__pk=id_folder, entity__pk=id_entity, is_author=False
            ).get(folder__folderentity__entity=user_entity, folder__folderentity__is_author=True)
        except FolderEntity.DoesNotExist as exc:
            raise NotFound from exc

    @extend_schema(request=FolderEntitySerializerDetailFolder, responses=FolderEntitySerializerDetailFolder, summary='Accept or restrict association',
                   tags=['folder entity author'])
    def update(self, request, id_folder, id_entity):
        folder_entity = self.get_object(id_folder, id_entity, request.user.entity)

        _data = {k: v for k, v in request.data.items() if k == 'is_accepted'}

        serializer = FolderEntitySerializerDetailFolder(folder_entity, data=_data, partial=True)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=HTTP_400_BAD_REQUEST)

    @extend_schema(request=None, responses=None, summary='Delete association', tags=['folder entity author'])
    def destroy(self, request, id_folder, id_entity):
        folder_entity = self.get_object(id_folder, id_entity, request.user.entity)

        folder_entity.delete()

        return Response(status=HTTP_204_NO_CONTENT)
