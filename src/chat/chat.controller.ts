import { Body, Controller, Get, Param, Post } from '@nestjs/common';
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

@Controller('chat')
export class ChatController {
  constructor(private chatService: ChatService) {}

  @ApiOperation({ summary: '채팅방 생성' })
  @Post('')
  async createChatRoom(@Body() body: CreateRoomDto, @Users() user: User) {
    return await this.chatService.createChatRoom(body.name, myId: user.id);
  }

  @ApiOperation({ summary: '특정 채팅방 채팅 생성' })
  @Post(':url')
  async createWorkspaceChannelChats(
    @Param('url') url: string,
    @Body() body: PostChatDto,
    @Users() user: User,
  ) {
    return this.chatService.createWorkspaceChannelChats({
      url,
      content: body.content,
      myId: user.id,
    });
  }
}
