
from django.contrib.auth import get_user_model
from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.status import HTTP_400_BAD_REQUEST, HTTP_204_NO_CONTENT, HTTP_201_CREATED, HTTP_403_FORBIDDEN, HTTP_202_ACCEPTED
from rest_framework.views import APIView
from rest_framework.exceptions import NotFound

from drf_spectacular.utils import extend_schema
from apps.main.permissions import IsOwner, IsAdminUser, AllowAny

from apps.main.serializers import ChangePasswordUserSerializer, PingPongSerializer, UserSerializer, CreateUserSerializer


class UserViewSet (viewsets.ViewSet):

    def get_permissions(self):
        if self.action in ['retrieve', 'update', 'destroy']:
            self.permission_classes = [IsOwner | IsAdminUser]
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

    @extend_schema(request=None, responses=None, summary='Delete user')
    def destroy(self, request, username):
        user = self.get_object(username)

        if user.is_superuser:
            return Response(status=HTTP_403_FORBIDDEN)

        user.delete()
        return Response(status=HTTP_204_NO_CONTENT)

    @extend_schema(request=CreateUserSerializer, responses=UserSerializer, summary='Create user')
    def create(self, request):
        serializer = CreateUserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response(UserSerializer(user).data, status=HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=HTTP_400_BAD_REQUEST)


class UserChangePassword(APIView):
    permission_classes = [IsOwner]

    def get_object(self, username):
        try:
            return get_user_model().objects.get(username=username)
        except get_user_model().DoesNotExist as exc:
            raise NotFound from exc

    @extend_schema(request=ChangePasswordUserSerializer,
                   responses=ChangePasswordUserSerializer, summary='Change password')
    def put(self, request, username):
        _username = getattr(request.user, 'username', None) if username == '@me' else username
        serializer = ChangePasswordUserSerializer(self.get_object(_username), data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
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
