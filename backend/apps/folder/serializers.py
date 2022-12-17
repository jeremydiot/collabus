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


class AttachmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Attachment

        fields = [
            'file',
            'name',
        ]


class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message

        fields = [
            'author',
            'content',
        ]


class FolderSerializer(serializers.ModelSerializer):

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
            'message'
        ]


class FolderSerializerList(serializers.ModelSerializer):

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
            'entity'
        ]
