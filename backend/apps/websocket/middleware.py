from urllib.parse import parse_qs
from asgiref.sync import sync_to_async

from channels.middleware import BaseMiddleware

from django.db import close_old_connections
from django.contrib.auth.models import AnonymousUser
from django.test.client import AsyncRequestFactory

from rest_framework_simplejwt.authentication import JWTAuthentication


# from rest_framework_simplejwt.state import


# https://github.com/joshua-hashimoto/django-channels-jwt-auth-middleware/blob/main/django_channels_jwt_auth_middleware/auth.py


class JwtAuthMiddleware(BaseMiddleware):
    def __init__(self, inner):
        self.inner = inner
        super().__init__(inner)

    async def __call__(self, scope, receive, send):
        close_old_connections()

        token = parse_qs(
            str(scope['query_string'], 'UTF-8')).get('token', None)

        if (token is None):
            scope['user'] = AnonymousUser()
        else:
            request = AsyncRequestFactory().get(
                '/', Authorization=f'Bearer {token[0]}')

            try:
                user = await sync_to_async(JWTAuthentication().authenticate)(request)
            except Exception:
                pass
            else:
                scope['user'] = user[0]

        return await super().__call__(scope, receive, send)
