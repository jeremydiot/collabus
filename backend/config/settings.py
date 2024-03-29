"""
Django settings for project project.

Generated by 'django-admin startproject' using Django 4.1.

For more information on this file, see
https://docs.djangoproject.com/en/4.1/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/4.1/ref/settings/
"""

import os
from urllib.parse import urlparse
from pathlib import Path
from datetime import timedelta

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent
APPS_DIR = BASE_DIR / 'apps'
DATA_DIR = BASE_DIR / 'data'
MEDIA_ROOT = BASE_DIR / 'media'
STATIC_ROOT = BASE_DIR / 'static'
FIXTURE_DIRS = [DATA_DIR / 'fixtures']

EXECUTION_ENVIRONMENT = os.environ.get('DJANGO_EXECUTION_ENVIRONMENT', 'development')

WEBSOCKET_CHAT_URL = os.environ.get('DJANGO_WEBSOCKET_CHAT_URL', 'websocket/consumer/chat/')

# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/4.1/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = os.environ.get('DJANGO_SECRET_KEY')

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = EXECUTION_ENVIRONMENT in ['development', 'staging']

ALLOWED_HOSTS = [
    urlparse(url).hostname
    for url
    in os.environ.get('DJANGO_BACKEND_URL', 'http://localhost:8000,http://127.0.0.1:8000').split(',')
]
CORS_ALLOWED_ORIGINS = os.environ.get('DJANGO_FRONTEND_URL', 'http://localhost:4200,http://127.0.0.1:4200').split(',')
CSRF_TRUSTED_ORIGINS = os.environ.get('DJANGO_BACKEND_URL', 'http://localhost:8000,http://127.0.0.1:8000').split(',')

SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(hours=5) if EXECUTION_ENVIRONMENT == 'development' else timedelta(minutes=5),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=1)
}

# Application definition
INSTALLED_APPS = [
    # websocket
    'daphne',

    # custom apps
    'apps.main',
    'apps.folder',
    'apps.websocket',

    # base
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    # additional libraries
    'rest_framework',
    'rest_framework_simplejwt',
    'corsheaders',
    *([
        'drf_spectacular'
    ] if EXECUTION_ENVIRONMENT in ['development', 'staging'] else [])
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'corsheaders.middleware.CorsMiddleware',  # additional library
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'config.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'config.wsgi.application'
ASGI_APPLICATION = 'config.asgi.application'

CHANNEL_LAYERS = {
    'default': {
        'BACKEND': 'channels_redis.core.RedisChannelLayer',
        'CONFIG': {
            'hosts': [(
                'redis' if EXECUTION_ENVIRONMENT in ['production', 'staging'] else 'localhost',
                '6379'
            )],
        }
    }
}


# Database
# https://docs.djangoproject.com/en/4.1/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': os.environ.get('DJANGO_DATABASE_NAME'),
        'USER': os.environ.get('DJANGO_DATABASE_USER'),
        'PASSWORD': os.environ.get('DJANGO_DATABASE_PSWD'),
        'HOST': 'postgres' if EXECUTION_ENVIRONMENT in ['production', 'staging'] else 'localhost',
        'PORT': '5432',
    }
}

# Password validation
# https://docs.djangoproject.com/en/4.1/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/4.1/topics/i18n/

LANGUAGE_CODE = 'fr'

TIME_ZONE = 'UTC'

USE_I18N = False

USE_L10N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/4.1/howto/static-files/

STATIC_URL = 'static/'
MEDIA_URL = 'media/'

# Default primary key field type
# https://docs.djangoproject.com/en/4.1/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

REST_FRAMEWORK = {
    'DEFAULT_PERMISSION_CLASSES': [
        'apps.main.permissions.DenyAny'
    ],
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework_simplejwt.authentication.JWTAuthentication'
    ],
    'DEFAULT_SCHEMA_CLASS': 'drf_spectacular.openapi.AutoSchema',
    'DEFAULT_PARSER_CLASSES': [
        'rest_framework.parsers.JSONParser',
    ]
}

SPECTACULAR_SETTINGS = {
    'COMPONENT_SPLIT_REQUEST': True
}

AUTH_USER_MODEL = 'main.User'

AUTHENTICATION_BACKENDS = ['apps.main.backends.AuthBackend']
