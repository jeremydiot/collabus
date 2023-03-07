
from django.contrib.auth import get_user_model
from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.status import HTTP_400_BAD_REQUEST, HTTP_201_CREATED, HTTP_202_ACCEPTED
from rest_framework.views import APIView
from rest_framework.exceptions import NotFound, ParseError, PermissionDenied
from rest_framework.decorators import action
from drf_spectacular.utils import extend_schema

from apps.main.models import Entity
from apps.main.permissions import IsOwner, AllowAny, HasCompanyEntity, HasSchoolEntity, IsEntityStaff, HasEntityAssociatedToFolder
from apps.main.serializers import UserPaswordSerializer, PingPongSerializer, UserSerializer, CreateUserWithEntitySerializer
from apps.main.utils import schema_parameters_builder, request_params_to_queryset
from apps.folder.models import Folder, FolderEntity
from apps.folder.serializers import FolderPrivateSerializer


class UserViewSet(viewsets.ViewSet):
    def get_permissions(self):
        if self.action in ['retrieve', 'update', 'password']:
            self.permission_classes = [IsOwner]
        if self.action == 'create':
            self.permission_classes = [AllowAny]
        return super().get_permissions()

    def get_object(self, username):
        try:
            return get_user_model().objects.get(username=username)
        except get_user_model().DoesNotExist as exc:
            raise NotFound from exc

    @extend_schema(request=UserSerializer, responses=UserSerializer, summary='Get user')
    def retrieve(self, request, username):
        _username = getattr(request.user, 'username', None) if username == '@me' else username
        return Response(UserSerializer(self.get_object(_username)).data)

    @extend_schema(request=UserSerializer, responses=UserSerializer, summary='Update user')
    def update(self, request, username):
        _username = getattr(request.user, 'username', None) if username == '@me' else username
        serializer = UserSerializer(self.get_object(_username), data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=HTTP_400_BAD_REQUEST)

    @extend_schema(request=CreateUserWithEntitySerializer,
                   responses=CreateUserWithEntitySerializer,
                   summary='Create user with entity'
                   )
    def create(self, request):
        serializer = CreateUserWithEntitySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=HTTP_400_BAD_REQUEST)

    @extend_schema(request=UserPaswordSerializer, responses=UserPaswordSerializer, summary='Update password')
    @action(detail=True, methods=['put'])
    def password(self, request, username):
        _username = getattr(request.user, 'username', None) if username == '@me' else username
        serializer = UserPaswordSerializer(self.get_object(_username), data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        else:
            return Response(serializer.errors, status=HTTP_400_BAD_REQUEST)


# TODO get only accepted relation for school
# TODO protect to non author company
class EntityFolderViewSet(viewsets.ViewSet):
    def get_permissions(self):
        if self.action == 'list':
            self.permission_classes = [HasCompanyEntity | HasSchoolEntity]
        if self.action == 'create':
            self.permission_classes = [HasCompanyEntity & IsEntityStaff]
        if self.action in ['retrieve', 'update']:
            self.permission_classes = [(HasCompanyEntity | HasSchoolEntity) & HasEntityAssociatedToFolder]
        return super().get_permissions()

    def get_object(self, id_entity, id_folder):
        try:
            return Folder.objects.get(
                id=id_folder,
                folderentity__entity__pk=id_entity,
                folderentity__is_accepted=True
            )
        except Folder.DoesNotExist as exc:
            raise NotFound from exc

    @extend_schema(parameters=schema_parameters_builder(
        fields=[field for field in FolderPrivateSerializer.Meta.fields if field != 'entities'],
        schema_list=True, description={
            'deadline': 'Date: YYYY-MM-DD - YYYY-MM-DD',
            'created_at': 'Date: YYYY-MM-DD - YYYY-MM-DD',
            'updated_at': 'Date: YYYY-MM-DD - YYYY-MM-DD',
            'kind': 'Aviable integers: ' + str(Folder.Kind.choices)
        }
    ), responses=FolderPrivateSerializer, summary='Get folder list of user entity', tags=['entity folder'])
    def list(self, request):
        id_entity = request.user.entity.pk
        queryset = Folder.objects.filter(folderentity__entity__pk=id_entity, folderentity__is_accepted=True)

        if (request.user.entity.kind != Entity.Kind.COMPANY):
            queryset = queryset.exclude(is_verified=False).exclude(is_hidden=True)

        try:
            queryset = request_params_to_queryset(
                params=request.GET,
                queryset=queryset,
                authorized_keys=[field for field in FolderPrivateSerializer.Meta.fields if field != 'entities'],
                custom_method={
                    'deadline': 'range',
                    'created_at': 'range',
                    'updated_at': 'range'
                }
            )
        except Exception as exc:
            raise ParseError from exc

        serializer = FolderPrivateSerializer(queryset, many=True)
        return Response(serializer.data)

    @extend_schema(request=FolderPrivateSerializer,
                   responses=FolderPrivateSerializer,
                   summary='Create new entity project', tags=['entity folder'])
    def create(self, request):
        serializer = FolderPrivateSerializer(data=request.data)
        if serializer.is_valid():
            folder = serializer.save(is_verified=True, author_entity=request.user.entity)
            FolderEntity(
                folder=folder,
                entity=request.user.entity,
                is_author=True,
                is_accepted=True
            ).save()
            return Response(FolderPrivateSerializer(folder).data, status=HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=HTTP_400_BAD_REQUEST)

    @extend_schema(request=FolderPrivateSerializer,
                   responses=FolderPrivateSerializer,
                   summary='Get entity project', tags=['entity folder'])
    def retrieve(self, request, id_folder):
        folder = self.get_object(request.user.entity.pk, id_folder)

        if request.user.entity.kind != Entity.Kind.COMPANY:
            if bool(folder.is_hidden or not folder.is_verified):
                raise PermissionDenied

        return Response(FolderPrivateSerializer(folder).data)

    @extend_schema(request=FolderPrivateSerializer,
                   responses=FolderPrivateSerializer,
                   summary='Update entity project', tags=['entity folder'])
    def update(self, request, id_folder):
        _data = {**request.data}
        folder = self.get_object(request.user.entity.pk, id_folder)

        if request.user.entity.kind != Entity.Kind.COMPANY:
            if bool(folder.is_closed or folder.is_hidden or not folder.is_verified):
                raise PermissionDenied
            _data = {'note': request.data.get('note', '')} if 'note' in request.data else {}

        serializer = FolderPrivateSerializer(folder, data=_data, partial=True)
        if serializer.is_valid():
            folder = serializer.save()
            return Response(FolderPrivateSerializer(folder).data, status=HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=HTTP_400_BAD_REQUEST)


class PingPong(APIView):
    permission_classes = [AllowAny]

    @extend_schema(parameters=[PingPongSerializer], responses=PingPongSerializer, summary='Sanity check')
    def get(self, request):
        serializer = PingPongSerializer(data=request.GET)
        if serializer.is_valid():
            return Response(serializer.data, status=HTTP_202_ACCEPTED)
        else:
            return Response(serializer.errors, status=HTTP_400_BAD_REQUEST)
