from rest_framework import serializers
from django.contrib.auth import get_user_model, password_validation


class CreateUserSerializer(serializers.ModelSerializer):

    def __init__(self, instance=None, data=..., *args, **kwargs):
        data['username'] = data['username'].lower()
        data['email'] = data['email'].lower()
        data['first_name'] = data['first_name'].capitalize()
        data['last_name'] = data['last_name'].capitalize()
        super().__init__(instance, data, *args, **kwargs)

    class Meta:
        model = get_user_model()
        fields = ['username', 'email', 'password', 'first_name', 'last_name']
        extra_kwargs = {
            'password': {'write_only': True},
        }

    def validate(self, attrs):
        password_validation.validate_password(attrs['password'], self.instance)
        return attrs

    def create(self, validated_data):
        user = get_user_model().objects.create_user(**validated_data)
        return user


class UserSerializer(serializers.ModelSerializer):
    def __init__(self, instance=None, data=..., *args, **kwargs):
        data['username'] = data['username'].lower()
        data['email'] = data['email'].lower()
        data['first_name'] = data['first_name'].capitalize()
        data['last_name'] = data['last_name'].capitalize()
        super().__init__(instance, data, *args, **kwargs)

    class Meta:
        model = get_user_model()
        fields = ['id', 'last_login', 'is_superuser', 'username', 'first_name',
                  'last_name', 'email', 'is_staff', 'is_active', 'date_joined']
        extra_kwargs = {
            'id': {'read_only': True},
            'last_login': {'read_only': True},
            'date_joined': {'read_only': True},
            'is_superuser': {'read_only': True},
            'is_staff': {'read_only': True},
            'is_active': {'read_only': True},
        }


class ChangePasswordUserSerializer(serializers.ModelSerializer):
    new_password = serializers.CharField(required=True, write_only=True)
    old_password = serializers.CharField(required=True, write_only=True)

    class Meta:
        model = model = get_user_model()
        fields = ['new_password', 'old_password']

    def validate(self, attrs):
        if (not self.instance.check_password(attrs['old_password'])):
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
        if (attrs['result'] != 'pong'):
            raise serializers.ValidationError('What\'s in your head ?')

        return attrs
