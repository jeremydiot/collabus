from django.contrib.auth import get_user_model, password_validation
from django.core.validators import RegexValidator
from rest_framework import serializers
from rest_framework.fields import empty
from rest_framework.validators import UniqueValidator
from .models import Entity


class EntitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Entity

        fields = ['pk', 'name', 'type', 'address', 'zip_code', 'city', 'country', 'phone', 'email']

        extra_kwargs = {
            'pk': {'read_only': True},
            'name': {'read_only': True},
            'type': {'read_only': True},
            'address': {'read_only': True},
            'zip_code': {'read_only': True},
            'city': {'read_only': True},
            'country': {'read_only': True},
            'phone': {'read_only': True},
            'email': {'read_only': True},
        }


class BaseUserSerializer(serializers.ModelSerializer):

    PHONE_FIELD_VALIDATOR = [
        RegexValidator(r'^\+[0-9]{11,14}$', message='Doit commencer par + suivi de 11 à 14 chiffres.')
    ]

    USERNAME_FIELD_VALIDATOR = [
        RegexValidator(r'^(?!@).*', message='Ne peut pas commencer par @.'),
        UniqueValidator(get_user_model().objects.all())
    ]

    def __init__(self, instance=None, data=empty, **kwargs):
        if data is not empty:
            if 'username' in data:
                data['username'] = data['username'].lower()
            if 'email' in data:
                data['email'] = data['email'].lower()
            if 'first_name' in data:
                data['first_name'] = data['first_name'].capitalize()
            if 'last_name' in data:
                data['last_name'] = data['last_name'].upper()
        super().__init__(instance, data, **kwargs)


class CreateUserSerializer(BaseUserSerializer):
    class Meta:
        model = get_user_model()

        fields = ['username', 'email', 'password', 'first_name', 'last_name', 'phone']

        extra_kwargs = {
            'password': {'write_only': True},
            'username': {'validators': BaseUserSerializer.USERNAME_FIELD_VALIDATOR},
            'phone': {'validators': BaseUserSerializer.PHONE_FIELD_VALIDATOR},
        }

    def validate(self, attrs):
        password_validation.validate_password(attrs['password'], self.instance)
        return attrs

    def create(self, validated_data):
        user = get_user_model().objects.create_user(**validated_data)
        return user


class UserSerializer(BaseUserSerializer):

    entity = EntitySerializer(read_only=True)

    class Meta:
        model = get_user_model()

        fields = ['pk', 'last_login', 'is_superuser', 'username', 'first_name',
                  'last_name', 'email', 'is_staff', 'is_active', 'date_joined',
                  'phone', 'entity']

        extra_kwargs = {
            'pk': {'read_only': True},
            'last_login': {'read_only': True},
            'date_joined': {'read_only': True},
            'is_superuser': {'read_only': True},
            'is_staff': {'read_only': True},
            'is_active': {'read_only': True},
            'entity': {'read_only': True},
            'username': {'validators': BaseUserSerializer.USERNAME_FIELD_VALIDATOR},
            'phone': {'validators': BaseUserSerializer.PHONE_FIELD_VALIDATOR},
        }


class ChangePasswordUserSerializer(serializers.ModelSerializer):

    new_password = serializers.CharField(required=True, write_only=True)
    old_password = serializers.CharField(required=True, write_only=True)

    class Meta:
        model = get_user_model()
        fields = ['new_password', 'old_password']

    def validate_old_password(self, value):
        if not self.instance.check_password(value):
            raise serializers.ValidationError('Ancien mot de passe incorrect.')
        return value

    def validate_new_password(self, value):
        password_validation.validate_password(value, self.instance)

    def save(self, **kwargs):
        self.instance.set_password(self.validated_data['new_password'])
        self.instance.save()
        return self.instance


class PingPongSerializer(serializers.Serializer):
    result = serializers.CharField(allow_blank=True, default="pong", max_length=4)

    def validate(self, attrs):
        if attrs['result'] != 'pong':
            raise serializers.ValidationError('What\'s in your head ?')

        return attrs

    def create(self, validated_data):
        return validated_data

    def update(self, instance, validated_data):
        return instance, validated_data
