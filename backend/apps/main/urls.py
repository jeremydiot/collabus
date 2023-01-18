from django.urls import path, include
from django.conf import settings
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView, TokenVerifyView
from drf_spectacular.views import SpectacularAPIView, SpectacularRedocView, SpectacularSwaggerView
from apps.main import views

urlpatterns = [
    path('token/', TokenObtainPairView.as_view(), name='token_obtain'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('token/verify/', TokenVerifyView.as_view(), name='token_verify'),

    *([
        path('schema/', SpectacularAPIView.as_view(), name='schema'),
        path('schema/swagger/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger'),
        path('schema/redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),
    ] if settings.EXECUTION_ENVIRONMENT in ['development', 'staging'] else []),

    path('user/', views.UserViewSet.as_view({'post': 'create'}), name='user'),
    path('user/<str:username>/', views.UserViewSet.as_view({'put': 'update', 'get': 'retrieve'}), name='user_detail'),
    path('user/<str:username>/password/', views.UserViewSet.as_view({'put': 'password'}), name='user_password'),

    path('entity/folder/', views.EntityFolderViewSet.as_view({'get': 'list', 'post': 'create'}), name='entity_folder'),
    path('entity/folder/<int:id_folder>/', views.EntityFolderViewSet.as_view(
        {'get': 'retrieve', 'put': 'update'}
    ), name='entity_folder_detail'),

    path('ping/', views.PingPong.as_view(), name='ping'),

    path('folder/', include('apps.folder.urls')),
]
