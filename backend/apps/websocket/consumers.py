import json
import enum
from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import sync_to_async
from django.conf import settings
from apps.folder.models import Folder, Message
# from apps.folder.serializers import MessageSerializer
# TODO uncomment Message serializer


class ChatKind(enum.Enum):
    UNKNOWN = 'unknown'
    FOLDER = 'folder'


class AsyncChatConsumer(AsyncWebsocketConsumer):
    def __init__(self, *args, **kwargs):
        self.chat_kind = ''
        self.chat_pk = ''
        self.room_group_name = ''
        self.kind_instance = None
        super().__init__(*args, **kwargs)

    async def connect(self):

        self.chat_kind = self.scope["url_route"]["kwargs"]["kind"]
        self.chat_pk = self.scope["url_route"]["kwargs"]["pk"]
        self.room_group_name = f'chat_{self.chat_kind}_{self.chat_pk}'

        if self.scope['user'].is_anonymous:
            await self.close(code=401)  # anonymous users unauthorized

        elif ChatKind(self.chat_kind) == ChatKind.FOLDER:
            try:
                self.kind_instance = await Folder.objects.aget(pk=int(self.chat_pk), folderentity__entity__id=self.scope['user'].entity_id)

            except Folder.DoesNotExist:
                await self.close(code=404)  # folder not found or wrong entity

            else:
                # Join room group
                await self.channel_layer.group_add(self.room_group_name, self.channel_name)
                await self.accept()

                # send previous messages
                queryset = self.kind_instance.message_set.all()
                # serializer = MessageSerializer(queryset, many=True)

                @sync_to_async
                def data(): ...
                # return serializer.data
                await self.send(text_data=json.dumps({"messages": await data()}))

        elif ChatKind(self.chat_kind) == ChatKind.UNKNOWN and settings.EXECUTION_ENVIRONMENT != 'production':
            # Join room group
            await self.channel_layer.group_add(self.room_group_name, self.channel_name)
            await self.accept()

        else:
            await self.close(code=403)  # need a valid chat kind

    async def disconnect(self, code):
        # Leave room group
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    # Receive message from WebSocket
    async def receive(self, text_data=None, bytes_data=None):
        text_data_json = json.loads(text_data)
        message = text_data_json["message"]
        if ChatKind(self.chat_kind) == ChatKind.FOLDER:
            await Message.objects.acreate(
                folder=self.kind_instance,
                author=self.scope['user'],
                content=message
            )

        # Send message to room group
        await self.channel_layer.group_send(
            self.room_group_name, {"kind": "chat_message", "message": message}
        )

    # Receive message from room group
    async def chat_message(self, event):
        message = event["message"]

        # Send message to WebSocket
        await self.send(text_data=json.dumps({"message": message}))
