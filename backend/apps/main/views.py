
from django.contrib.auth import get_user_model
from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.status import HTTP_400_BAD_REQUEST, HTTP_201_CREATED, HTTP_202_ACCEPTED
from rest_framework.views import APIView
from rest_framework.exceptions import NotFound
from rest_framework.decorators import action

from drf_spectacular.utils import extend_schema
from apps.main.permissions import IsOwner, AllowAny, IsAuthenticated

from apps.main.serializers import UserPaswordSerializer, PingPongSerializer, UserSerializer


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
            return Response(serializer.data)
        else:
            return Response(serializer.errors, status=HTTP_400_BAD_REQUEST)

    @extend_schema(request=UserSerializer, responses=UserSerializer, summary='Create user')
    def create(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response(UserSerializer(user).data, status=HTTP_201_CREATED)
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


# TODO to implement
class EntityFolderViewSet(viewsets.ViewSet):
    def get_permissions(self):
        if self.action == 'list':
            self.permission_classes = [IsAuthenticated]
        return super().get_permissions()

    def list(self, request): ...


class PingPong(APIView):
    permission_classes = [AllowAny]

    @extend_schema(parameters=[PingPongSerializer], responses=PingPongSerializer, summary='Sanity check')
    def get(self, request):
        serializer = PingPongSerializer(data=request.GET)
        if serializer.is_valid():
            return Response(serializer.data, status=HTTP_202_ACCEPTED)
        else:
            return Response(serializer.errors, status=HTTP_400_BAD_REQUEST)
