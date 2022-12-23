"""
ASGI config for project project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/4.1/howto/deployment/asgi/
"""

import os
from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.security.websocket import AllowedHostsOriginValidator
from channels.auth import AuthMiddlewareStack

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django_asgi_app = get_asgi_application()


def _application():

    from apps.websocket.routing import websocket_urlpatterns  # pylint: disable=import-outside-toplevel
    from apps.websocket.middleware import JwtAuthMiddleware  # pylint: disable=import-outside-toplevel

    return ProtocolTypeRouter({
        'http': django_asgi_app,
        'websocket':
        AllowedHostsOriginValidator(
            JwtAuthMiddleware(
                AuthMiddlewareStack(
                    URLRouter(websocket_urlpatterns)
                )
            )
        )
    })


application = _application()
