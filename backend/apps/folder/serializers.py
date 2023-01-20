from rest_framework import serializers
from rest_framework.exceptions import ValidationError
from apps.folder.models import Folder, Attachment, Message, FolderEntity
from apps.main.serializers import EntitySerializer, UserSerializer


class FolderEntitySerializerDetailEntity(serializers.ModelSerializer):
    entity = EntitySerializer(read_only=True)

    # def validate(self, attrs):
    #     try:
    #         attrs['entity'] = Entity.objects.get(pk=self.initial_data['entity'])
    #     except Entity.DoesNotExist as exc:
    #         raise ValidationError({'entity': 'Entity does not exist.'}) from exc

    #     attrs['is_author'] = False
    #     return attrs

    class Meta:
        model = FolderEntity
        fields = [
            'folder',
            'entity',
            'is_author',
            'is_accepted',
            'created_at',
            'updated_at',
        ]

        extra_kwargs = {
            'is_author': {'read_only': True},
            'created_at': {'read_only': True},
            'updated_at': {'read_only': True},
        }


class FolderPublicSerializer(serializers.ModelSerializer):
    class Meta:
        model = Folder
        fields = [
            'pk',
            'name',
            'description',
            'kind',
            'deadline',
        ]

        extra_kwargs = {
            'pk': {'read_only': True},
            'name': {'read_only': True},
            'description': {'read_only': True},
            'kind': {'read_only': True},
            'deadline': {'read_only': True},
        }


class FolderPrivateSerializer(serializers.ModelSerializer):

    # TODO get only accepted relation entities
    entities = FolderEntitySerializerDetailEntity(source='folderentity_set', many=True, read_only=True)

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
            'created_at',
            'updated_at',
            'entities',
        ]

        extra_kwargs = {
            'pk': {'read_only': True},
            'created_at': {'read_only': True},
            'updated_at': {'read_only': True},
            'entities': {'read_only': True},
        }


class FolderEntitySerializerDetailFolder(serializers.ModelSerializer):
    folder = FolderPublicSerializer(read_only=True)

    def validate(self, attrs):
        try:
            attrs['folder'] = Folder.objects.get(pk=self.initial_data['folder'])
        except Folder.DoesNotExist as exc:
            raise ValidationError({'folder': 'Entity does not exist.'}) from exc

        return attrs

    class Meta:
        model = FolderEntity
        fields = [
            'folder',
            'entity',
            'is_author',
            'is_accepted',
            'created_at',
            'updated_at',
        ]

        extra_kwargs = {
            'is_author': {'read_only': True},
            'created_at': {'read_only': True},
            'updated_at': {'read_only': True},
        }


# TODO disable update folder and file
class AttachmentSerializer(serializers.ModelSerializer):

    class Meta:
        model = Attachment

        fields = [
            'pk',
            'folder',
            'file',
            'name',
            'created_at',
            'updated_at',
        ]

        extra_kwargs = {
            'pk': {'read_only': True},
            'created_at': {'read_only': True},
            'updated_at': {'read_only': True},
            'folder': {'required': False},
            'file': {'required': False},
        }


class MessageSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True)

    class Meta:
        model = Message

        fields = [
            'pk',
            'author',
            'folder',
            'content',
            'created_at',
            'updated_at',
        ]

        extra_kwargs = {
            'pk': {'read_only': True},
            'author': {'read_only': True},
            'folder': {'read_only': True},
            'content': {'read_only': True},
            'created_at': {'read_only': True},
            'updated_at': {'read_only': True},
        }
