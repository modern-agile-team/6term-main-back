import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatRoom, ChatRoomSchema } from './schemas/chat-room.schemas';
import { Chat, ChatSchema } from './schemas/chat.schemas';
import { ChatImage, ChatImageSchema } from './schemas/chat-image.schemas';
import {
  ChatNotification,
  ChatNotificationSchema,
} from './schemas/chat-notifiation.schemas';
import { EventsModule } from 'src/events/events.module';
import { S3Module } from 'src/common/s3/s3.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ChatRoom.name, schema: ChatRoomSchema },
      { name: Chat.name, schema: ChatSchema },
      { name: ChatImage.name, schema: ChatImageSchema },
      { name: ChatNotification.name, schema: ChatNotificationSchema },
    ]),
    EventsModule,
    S3Module,
  ],
  controllers: [ChatController],
  providers: [ChatService],
})
export class ChatModule {}
