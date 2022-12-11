from rest_framework.permissions import BasePermission
from rest_framework import exceptions


class IsAuthenticated(BasePermission):
    def has_permission(self, request, view):
        if not bool(request.user and request.user.is_authenticated):
            raise exceptions.NotAuthenticated

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


class DenyAny(BasePermission):
    def has_permission(self, request, view):
        raise exceptions.PermissionDenied


class AllowAny(BasePermission):
    def has_permission(self, request, view):
        return True
