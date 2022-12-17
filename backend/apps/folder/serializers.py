from rest_framework import serializers
from apps.folder.models import Folder, Attachment, Message, FolderEntity


class FolderEntitySerializer(serializers.ModelSerializer):
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

    entities = FolderEntitySerializer(source='folderentity_set', many=True, read_only=True)
    attachments = AttachmentSerializer(source='attachment_set', many=True, read_only=True)
    messages = MessageSerializer(source='message_set', many=True, read_only=True)

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
            'entities',
            'attachments',
            'messages'
        ]
