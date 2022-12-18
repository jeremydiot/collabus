from rest_framework.permissions import BasePermission
from rest_framework.exceptions import NotAuthenticated, PermissionDenied, NotFound

from apps.main.models import Entity
from apps.folder.models import Folder


class IsAuthenticated(BasePermission):
    def has_permission(self, request, view):
        if not bool(request.user and request.user.is_authenticated):
            raise NotAuthenticated

        return True


class IsOwner(BasePermission):
    def has_permission(self, request, view):
        username = getattr(request.user, 'username', None)
        return bool(
            IsAuthenticated().has_permission(request, view)
            and username
            and (view.kwargs.get('username', None) == '@me' or view.kwargs.get('username', None) == username)
        )


class IsAdminUser(BasePermission):
    def has_permission(self, request, view):
        return bool(
            IsAuthenticated().has_permission(request, view)
            and request.user.is_staff
        )


class HasCompanyEntity(BasePermission):
    def has_permission(self, request, view):
        return bool(
            IsAuthenticated().has_permission(request, view)
            and getattr(request.user, 'entity', None)
            and request.user.entity.type == Entity.Type.COMPANY
        )


class HasEntityFolderAuthor(BasePermission):
    def has_permission(self, request, view):

        try:
            folder = Folder.objects.get(pk=view.kwargs.get('pk', None))
        except Folder.DoesNotExist as exc:
            raise NotFound from exc

        return bool(
            HasCompanyEntity().has_permission(request, view)
            and folder.folderentity_set.all().filter(entity=request.user.entity, is_author=True).exists()
        )


class HasEntityFolderAssigned(BasePermission):
    def has_permission(self, request, view):

        try:
            folder = Folder.objects.get(pk=view.kwargs.get('pk', None))
        except Folder.DoesNotExist as exc:
            raise NotFound from exc

        return bool(
            IsAuthenticated().has_permission(request, view)
            and getattr(request.user, 'entity', None)
            and folder.folderentity_set.all().filter(entity=request.user.entity).exists()
        )


class DenyAny(BasePermission):
    def has_permission(self, request, view):
        raise PermissionDenied


class AllowAny(BasePermission):
    def has_permission(self, request, view):
        return True
