import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Sse,
  UploadedFile,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ChatService } from '../services/chat.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ReceivedUserDto } from '../dto/received-user.dto';
import { PostChatDto } from '../dto/post-chat.dto';
import mongoose from 'mongoose';
import { FileInterceptor } from '@nestjs/platform-express';
import { Users } from 'src/common/decorators/user.decorator';
import { User } from 'src/users/entities/user.entity';
import { ParseObjectIdPipe } from '../parse-object-id.pipe';
import { NotificationService } from '../services/notification.service';

@ApiTags('CHAT')
@Controller('chat-room')
@UsePipes(ValidationPipe)
export class ChatController {
  constructor(
    private chatService: ChatService,
    private notificationService: NotificationService,
  ) {}

  @Sse('listener')
  notificationListener() {
    return this.chatService.notificationListener();
  }

  @ApiOperation({ summary: '채팅방 전체 조회' })
  @Get()
  async getChatRooms(@Users() user: User) {
    return this.chatService.getChatRooms(user.id);
  }

  @ApiOperation({ summary: '채팅방 단일 조회' })
  @Get(':roomId')
  async getOneChatRoom(
    @Users() user: User,
    @Param('roomId', ParseObjectIdPipe) roomId: mongoose.Types.ObjectId,
  ) {
    return this.chatService.getOneChatRoom(user.id, roomId);
  }

  @ApiOperation({ summary: '채팅방 생성' })
  @Post()
  async createChatRoom(@Users() user: User, @Body() body: ReceivedUserDto) {
    return this.chatService.createChatRoom(user.id, body.receiverId);
  }

  @ApiOperation({ summary: '해당 채팅방 삭제' })
  @Delete(':roomId')
  async deleteChatRoom(
    @Users() user: User,
    @Param('roomId', ParseObjectIdPipe) roomId: mongoose.Types.ObjectId,
  ) {
    return this.chatService.deleteChatRoom(user.id, roomId);
  }

  @ApiOperation({ summary: '특정 채팅방 채팅 전체 조회' })
  @Get(':roomId/chat')
  async getChats(
    @Param('roomId', ParseObjectIdPipe) roomId: mongoose.Types.ObjectId,
  ) {
    return this.chatService.getChats(roomId);
  }

  @ApiOperation({ summary: '특정 채팅방 채팅 생성' })
  @Post(':roomId/chat/:testUser')
  async createChat(
    @Param('testUser') testUser: number,
    @Users() user: User,
    @Param('roomId', ParseObjectIdPipe) roomId: mongoose.Types.ObjectId,
    @Body() body: PostChatDto,
  ) {
    return this.chatService.createChat(
      roomId,
      body.content,
      testUser,
      body.receiverId,
    );
  }

  @ApiOperation({ summary: '특정 채팅방 채팅 이미지 생성' })
  @Post(':roomId/chat/image')
  @UseInterceptors(FileInterceptor('file'))
  async createChatImage(
    @Param('roomId', ParseObjectIdPipe) roomId: mongoose.Types.ObjectId,
    @Users() user: User,
    @Body() body: ReceivedUserDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.chatService.createChatImage(
      roomId,
      user.id,
      body.receiverId,
      file,
    );
  }
}
