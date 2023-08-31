import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatRoomSchema } from './schemas/chat-room.schemas';

@Module({
  imports: [MongooseModule.forFeature([{ name:'ChatRoom', schema: ChatRoomSchema}])],
  controllers: [ChatController],
  providers: [ChatService]
})
export class ChatModule {}
