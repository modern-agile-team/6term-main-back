import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatRoom } from './schemas/chat-room.schemas';
import { Chat } from './schemas/chat.schemas';
import { ChatNotification } from './schemas/chat-notifiation.schemas';
import { ChatImage } from './schemas/chat-image.schemas';
import { ApiOperation } from '@nestjs/swagger';
import { Users } from 'src/common/decorators/user.decorator';
import { User } from 'src/users/entities/user.entity';
import { PostChatDto } from './dto/post-chat.dto';
import { CreateRoomDto } from './dto/create-room.dto';
import mongoose from 'mongoose';

@Controller('chat')
export class ChatController {
  constructor(private chatService: ChatService) {}

  @ApiOperation({ summary: '채팅방 생성' })
  @Post(':testUser')
  // async createChatRoom(@Users() user: User) {
  async createChatRoom(
    @Param('testUser', ParseIntPipe) testUser: number,
    @Body('guestId', ParseIntPipe) guestId: number,
  ) {
    return await this.chatService.createChatRoom(testUser, guestId);
    // return await this.chatService.createChatRoom(user.id);
  }

  @ApiOperation({ summary: '특정 채팅방 채팅 생성' })
  @Post(':roomId/:senderId/:receiverId')
  async createChat(
    @Param('roomId') roomId: mongoose.Types.ObjectId,
    @Param('receiverId', ParseIntPipe) receiverId: number,
    @Body() body: PostChatDto,
    @Param('senderId', ParseIntPipe) senderId: number,
    // @Users() senderId: number,
  ) {
    return this.chatService.createChat(
      roomId,
      body.content,
      senderId,
      receiverId,
    );
  }
}
