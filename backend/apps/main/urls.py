from django.urls import path, include
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView, TokenVerifyView, TokenBlacklistView
from drf_spectacular.views import SpectacularAPIView, SpectacularRedocView, SpectacularSwaggerView
from apps.main import views

urlpatterns = [
    path('user/', views.UserViewSet.as_view({'post': 'create'}), name='user_create'),
    path(
        'user/<str:username>/',
        views.UserViewSet.as_view({'put': 'update', 'delete': 'destroy', 'get': 'retrieve'}),
        name='user'
    ),
    path('user/<str:username>/change_password/', views.UserChangePassword.as_view(), name='user_change_password'),

    path('token/', TokenObtainPairView.as_view(), name='token_obtain'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('token/verify/', TokenVerifyView.as_view(), name='token_verify'),
    path('token/blacklist/', TokenBlacklistView.as_view(), name='token_blacklist'),

    path('schema/', SpectacularAPIView.as_view(), name='schema'),
    path('schema/swagger/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger'),
    path('schema/redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),

    path('ping/', views.PingPong.as_view(), name='ping'),

    path('folder/', include('apps.folder.urls')),

]
