from django.contrib.auth import get_user_model, password_validation
from django.core.validators import RegexValidator
from rest_framework import serializers
from rest_framework.fields import empty
from rest_framework.validators import UniqueValidator


class CreateUserSerializer(serializers.ModelSerializer):

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

    class Meta:
        model = get_user_model()

        fields = ['username', 'email', 'password', 'first_name', 'last_name']

        extra_kwargs = {
            'password': {'write_only': True},
            'username': {'validators': [RegexValidator('^(?!@).*', message='Ne peut pas commencer par @'), UniqueValidator(get_user_model().objects.all())]},
        }

    def validate(self, attrs):
        password_validation.validate_password(attrs['password'], self.instance)
        return attrs

    def create(self, validated_data):
        user = get_user_model().objects.create_user(**validated_data)
        return user


class UserSerializer(serializers.ModelSerializer):
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

    class Meta:
        model = get_user_model()

        fields = ['id', 'last_login', 'is_superuser', 'username', 'first_name',
                  'last_name', 'email', 'is_staff', 'is_active', 'date_joined',
                  'groups', 'user_permissions']

        extra_kwargs = {
            'id': {'read_only': True},
            'last_login': {'read_only': True},
            'date_joined': {'read_only': True},
            'is_superuser': {'read_only': True},
            'is_staff': {'read_only': True},
            'is_active': {'read_only': True},
            'groups': {'read_only': True},
            'user_permissions': {'read_only': True},
            'username': {'validators': [RegexValidator('^(?!@).*', message='Ne peut pas commencer par @'), UniqueValidator(get_user_model().objects.all())]},
        }


class ChangePasswordUserSerializer(serializers.ModelSerializer):
    new_password = serializers.CharField(required=True, write_only=True)
    old_password = serializers.CharField(required=True, write_only=True)

    class Meta:
        model = get_user_model()
        fields = ['new_password', 'old_password']

    def validate(self, attrs):
        if not self.instance.check_password(attrs['old_password']):
            raise serializers.ValidationError('Wrong old password')
        password_validation.validate_password(attrs['new_password'], self.instance)
        return attrs

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
