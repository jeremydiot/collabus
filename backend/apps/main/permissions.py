from rest_framework.permissions import BasePermission
from rest_framework.exceptions import NotAuthenticated, PermissionDenied

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
            and view.kwargs.get('username', None) in ['@me', username]
        )


class IsAdminUser(BasePermission):
    def has_permission(self, request, view):
        return bool(
            IsAuthenticated().has_permission(request, view)
            and request.user.is_staff
        )


class IsEntityStaff(BasePermission):
    def has_permission(self, request, view):
        return bool(
            IsAuthenticated().has_permission(request, view)
            and request.user.is_entity_staff
        )


class HasCompanyEntity(BasePermission):
    def has_permission(self, request, view):
        return bool(
            IsAuthenticated().has_permission(request, view)
            and request.user.entity
            and request.user.entity.kind == Entity.Kind.COMPANY
        )


class HasEntityAssociatedToFolder(BasePermission):
    def has_permission(self, request, view):
        return bool(
            IsAuthenticated().has_permission(request, view)
            and request.user.entity
            and Folder.objects.filter(
                id=view.kwargs.get('id_folder', None),
                folderentity__entity=request.user.entity,
                folderentity__is_accepted=True
            ).exists()
        )


class HasSchoolEntity(BasePermission):
    def has_permission(self, request, view):
        return bool(
            IsAuthenticated().has_permission(request, view)
            and request.user.entity
            and request.user.entity.kind == Entity.Kind.SCHOOL
        )


class DenyAny(BasePermission):
    def has_permission(self, request, view):
        raise PermissionDenied


class AllowAny(BasePermission):
    def has_permission(self, request, view):
        return True
