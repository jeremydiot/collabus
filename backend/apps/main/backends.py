from django.contrib.auth.backends import ModelBackend
from django.contrib.auth import get_user_model
from django.db.models import Q


class AuthBackend(ModelBackend):
    def authenticate(self, request, username=None, password=None, **kwargs):
        user_model = get_user_model()
        if not username:
            username = kwargs.get(user_model.USERNAME_FIELD) or kwargs.get(user_model.EMAIL_FIELD)
        if not username or not password:
            return
        try:
            # user = UserModel._default_manager.get_by_natural_key(username)
            user = user_model.objects.get(Q(username__iexact=username) | Q(email__iexact=username))
        except user_model.DoesNotExist:
            # Run the default password hasher once to reduce the timing
            # difference between an existing and a nonexistent user (#20760).
            user_model().set_password(password)
        else:
            if user.check_password(password) and self.user_can_authenticate(user):
                return user
