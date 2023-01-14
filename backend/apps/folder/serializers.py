from rest_framework import serializers
from rest_framework.exceptions import ValidationError
from apps.folder.models import Folder, Attachment, Message, FolderEntity, Entity
from apps.main.serializers import EntitySerializer, UserSerializer


class FolderEntitySerializer(serializers.ModelSerializer):
    entity = EntitySerializer(read_only=True)

    def validate(self, attrs):
        try:
            attrs['entity'] = Entity.objects.get(pk=self.initial_data['entity'])
        except Entity.DoesNotExist as exc:
            raise ValidationError({'entity': 'Entity does not exist.'}) from exc

        attrs['is_author'] = False
        return attrs

    class Meta:
        model = FolderEntity
        fields = [
            'folder',
            'entity',
            'is_author',
        ]

        extra_kwargs = {
            'is_author': {'read_only': True},
        }


class AttachmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Attachment

        fields = [
            'file',
            'name',
        ]

        extra_kwargs = {
            'file': {'read_only': True},
            'name': {'read_only': True},
        }


class MessageSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True)

    class Meta:
        model = Message

        fields = [
            'author',
            'content',
            'created_at',
            'updated_at',
        ]

        extra_kwargs = {
            'author': {'read_only': True},
            'content': {'read_only': True},
            'created_at': {'read_only': True},
            'updated_at': {'read_only': True},
        }


class FolderSerializerFull(serializers.ModelSerializer):

    entity = FolderEntitySerializer(source='folderentity_set', many=True, read_only=True)
    attachment = AttachmentSerializer(source='attachment_set', many=True, read_only=True)

    class Meta:
        model = Folder

        fields = [
            'pk',
            'name',
            'description',
            'note',
            'kind',
            'is_closed',
            'is_hidden',
            'deadline',
            'entity',
            'attachment',
            'created_at',
            'updated_at',
        ]

        extra_kwargs = {
            'pk': {'read_only': True},
            'created_at': {'read_only': True},
            'updated_at': {'read_only': True},
        }


class FolderSerializerPartial(serializers.ModelSerializer):

    entity = FolderEntitySerializer(source='folderentity_set', many=True, read_only=True)

    class Meta:
        model = Folder

        fields = [
            'pk',
            'name',
            'description',
            'note',
            'kind',
            'is_closed',
            'is_hidden',
            'deadline',
            'entity',
            'created_at',
            'updated_at',
        ]

        extra_kwargs = {
            'pk': {'read_only': True},
            'created_at': {'read_only': True},
            'updated_at': {'read_only': True},
        }
