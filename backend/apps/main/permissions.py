from rest_framework.permissions import BasePermission


class IsOwner(BasePermission):
    def has_permission(self, request, view):
        username = getattr(request.user, 'username', None)
        return bool(
            request.user.is_authenticated
            and username
            and (view.kwargs.get('username', None) == '@me' or view.kwargs.get('username', None) == username)
        )


class DenyAny(BasePermission):
    def has_permission(self, request, view):
        return False
