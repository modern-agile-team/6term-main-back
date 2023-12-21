import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Sse,
  UploadedFile,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ChatService } from '../services/chat.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ReceivedUserDto } from '../dto/received-user.dto';
import mongoose from 'mongoose';
import { FileInterceptor } from '@nestjs/platform-express';
import { Users } from 'src/common/decorators/user.decorator';
import { User } from 'src/users/entities/user.entity';
import { ParseObjectIdPipe } from '../parse-object-id.pipe';
import { ApiCreateChatRoom } from '../swagger-decorators/create-chat-room.decorator';
import { ApiGetChatRooms } from '../swagger-decorators/get-chat-rooms.decorator';
import { ApiGetOneChatRoom } from '../swagger-decorators/get-one-chat-room.decorator';
import { ApiDeleteChatRoom } from '../swagger-decorators/delete-chat-room.decorator';
import { ApiGetChats } from '../swagger-decorators/get-chats.decorator';
import { ApiGetChatNotification } from '../swagger-decorators/get-chat-notification.decorator';
import { ApiGetChatUnreadCounts } from '../swagger-decorators/get-chat-unread-counts.decorator';
import { TokenService } from 'src/auth/services/token.service';

@ApiTags('CHAT')
@Controller('chat-room')
@UsePipes(ValidationPipe)
export class ChatController {
  constructor(
    private chatService: ChatService,
    private tokenService: TokenService,
  ) {}

  @ApiGetChatNotification()
  @Sse('listener')
  notificationListener() {
    return this.chatService.notificationListener();
  }

  @ApiGetChatRooms()
  @Get()
  async getChatRooms(@Users() user: User) {
    return this.chatService.getChatRooms(user.id);
  }

  @ApiGetOneChatRoom()
  @Get(':roomId')
  async getOneChatRoom(
    @Users() user: User,
    @Param('roomId', ParseObjectIdPipe) roomId: mongoose.Types.ObjectId,
  ) {
    return this.chatService.getOneChatRoom(user.id, roomId);
  }

  @ApiCreateChatRoom()
  @Post()
  async createChatRoom(@Users() user: User, @Body() body: ReceivedUserDto) {
    return this.chatService.createChatRoom(user.id, body.receiverId);
  }

  @ApiDeleteChatRoom()
  @Delete(':roomId')
  async deleteChatRoom(
    @Users() user: User,
    @Param('roomId', ParseObjectIdPipe) roomId: mongoose.Types.ObjectId,
  ) {
    return this.chatService.deleteChatRoom(user.id, roomId);
  }

  @ApiGetChats()
  @Get(':roomId/chat')
  async getChats(
    @Param('roomId', ParseObjectIdPipe) roomId: mongoose.Types.ObjectId,
  ) {
    return this.chatService.getChats(roomId);
  }

  @ApiOperation({ summary: '특정 채팅방 채팅 이미지 생성' })
  @Post(':roomId/chat/image')
  @UseInterceptors(FileInterceptor('file'))
  async createChatImage(
    @Param('roomId', ParseObjectIdPipe) roomId: mongoose.Types.ObjectId,
    @Headers('access_token') accessToken: string,
    @Body() body: ReceivedUserDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const senderId = await this.tokenService.decodeToken(accessToken);
    return this.chatService.createChatImage(
      roomId,
      senderId,
      body.receiverId,
      file,
    );
  }

  @ApiGetChatUnreadCounts()
  @Get(':roomId/chat/unReads')
  async getUnreadCounts(
    @Param('roomId', ParseObjectIdPipe) roomId: mongoose.Types.ObjectId,
    @Query('after', ParseIntPipe) after: number,
  ) {
    return this.chatService.getUnreadCounts(roomId, after);
  }
}
