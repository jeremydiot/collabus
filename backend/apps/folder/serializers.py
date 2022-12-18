from rest_framework import serializers
from apps.folder.models import Folder, Attachment, Message, FolderEntity
from apps.main.serializers import EntitySerializer


class FolderEntitySerializer(serializers.ModelSerializer):
    entity = EntitySerializer(read_only=True)

    class Meta:
        model = FolderEntity

        fields = [
            'entity',
            'is_author',
        ]

        extra_kwargs = {
            'entity': {'read_only': True},
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
    class Meta:
        model = Message

        fields = [
            'author',
            'content',
        ]

        extra_kwargs = {
            'author': {'read_only': True},
            'content': {'read_only': True},
        }


class FolderSerializerFull(serializers.ModelSerializer):

    entity = FolderEntitySerializer(source='folderentity_set', many=True, read_only=True)
    attachment = AttachmentSerializer(source='attachment_set', many=True, read_only=True)
    message = MessageSerializer(source='message_set', many=True, read_only=True)

    class Meta:
        model = Folder

        fields = [
            'pk',
            'name',
            'description',
            'note',
            'type',
            'is_closed',
            'is_hidden',
            'deadline',
            'entity',
            'attachment',
            'message',
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
            'type',
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
