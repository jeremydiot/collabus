from django.contrib.auth import get_user_model, password_validation
from django.core.validators import RegexValidator
from rest_framework import serializers
from rest_framework.fields import empty
from rest_framework.validators import UniqueValidator
from .models import Entity


class EntitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Entity

        fields = ['name', 'kind', 'address', 'zip_code', 'city', 'country', 'phone', 'email', 'pk']

        extra_kwargs = {
            'pk': {'read_only': True},
            'name': {'read_only': True},
            'kind': {'read_only': True},
            'address': {'read_only': True},
            'zip_code': {'read_only': True},
            'city': {'read_only': True},
            'country': {'read_only': True},
            'phone': {'read_only': True},
            'email': {'read_only': True},
        }


class UserSerializer(serializers.ModelSerializer):

    entity = EntitySerializer(read_only=True)

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

    def validate_password(self, value):
        if value:
            password_validation.validate_password(value, self.instance)
        return value

    def create(self, validated_data):
        user = get_user_model().objects.create_user(**validated_data)
        return user

    def update(self, instance, validated_data):
        validated_data.pop('password', None)
        return super().update(instance, validated_data)

    class Meta:
        model = get_user_model()

        fields = ['last_login', 'date_joined', 'username', 'email', 'phone',
                  'first_name', 'last_name', 'entity', 'is_entity_staff', 'password']

        extra_kwargs = {
            'last_login': {'read_only': True},
            'date_joined': {'read_only': True},
            'entity': {'read_only': True},
            'is_entity_staff': {'read_only': True},
            'password': {'write_only': True},
            'username': {
                'validators': [
                    RegexValidator(r'^(?!@).*', message='C\'ant start with @.'),
                    UniqueValidator(get_user_model().objects.all())
                ]
            },
            'phone': {
                'validators': [
                    RegexValidator(r'^\+[0-9]{11,14}$', message='Must start with + followed by 11 to 14 digits.')
                ]
            },
        }


class UserPaswordSerializer(serializers.ModelSerializer):

    new_password = serializers.CharField(required=True, write_only=True)
    old_password = serializers.CharField(required=True, write_only=True)

    class Meta:
        model = get_user_model()
        fields = ['new_password', 'old_password']

    def validate_old_password(self, value):
        if not self.instance.check_password(value):
            raise serializers.ValidationError('Wrong old password.')
        return value

    def validate_new_password(self, value):
        password_validation.validate_password(value, self.instance)
        return value

    def save(self, **kwargs):
        self.instance.set_password(self.validated_data['new_password'])
        self.instance.save()
        return self.instance


class PingPongSerializer(serializers.Serializer):
    result = serializers.CharField(allow_blank=True, default='pong', max_length=4)

    def validate_result(self, value):
        if value != 'pong':
            raise serializers.ValidationError('What\'s in your head ?')

        return value

    def create(self, validated_data):
        ...

    def update(self, instance, validated_data):
        ...
