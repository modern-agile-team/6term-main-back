import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Sse,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ChatService } from '../services/chat.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ReceivedUserDto } from '../dto/received-user.dto';
import mongoose from 'mongoose';
import { FileInterceptor } from '@nestjs/platform-express';
import { ParseObjectIdPipe } from '../parse-object-id.pipe';
import { ApiCreateChatRoom } from '../swagger-decorators/create-chat-room.decorator';
import { ApiGetChatRooms } from '../swagger-decorators/get-chat-rooms.decorator';
import { ApiGetOneChatRoom } from '../swagger-decorators/get-one-chat-room.decorator';
import { ApiDeleteChatRoom } from '../swagger-decorators/delete-chat-room.decorator';
import { ApiGetChats } from '../swagger-decorators/get-chats.decorator';
import { ApiGetChatNotification } from '../swagger-decorators/get-chat-notification.decorator';
import { ApiGetChatUnreadCounts } from '../swagger-decorators/get-chat-unread-counts.decorator';
import { TokenService } from 'src/auth/services/token.service';
import { GetUserId } from 'src/common/decorators/get-userId.decorator';
import { JwtAccessTokenGuard } from 'src/config/guards/jwt-access-token.guard';

@ApiTags('CHAT')
@UseGuards(JwtAccessTokenGuard)
@UsePipes(ValidationPipe)
@Controller('chat-room')
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
  async getChatRooms(@GetUserId() userId: number) {
    return this.chatService.getChatRooms(userId);
  }

  @ApiGetOneChatRoom()
  @Get(':roomId')
  async getOneChatRoom(
    @GetUserId() userId: number,
    @Param('roomId', ParseObjectIdPipe) roomId: mongoose.Types.ObjectId,
  ) {
    return this.chatService.getOneChatRoom(userId, roomId);
  }

  @ApiCreateChatRoom()
  @Post()
  async createChatRoom(
    @GetUserId() userId: number,
    @Body() body: ReceivedUserDto,
  ) {
    return this.chatService.createChatRoom(userId, body.receiverId);
  }

  @ApiDeleteChatRoom()
  @Delete(':roomId')
  async deleteChatRoom(
    @GetUserId() userId: number,
    @Param('roomId', ParseObjectIdPipe) roomId: mongoose.Types.ObjectId,
  ) {
    return this.chatService.deleteChatRoom(userId, roomId);
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
    @GetUserId() senderId: number,
    @Body() body: ReceivedUserDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.chatService.createChatImage(
      roomId,
      senderId,
      body.receiverId,
      file,
    );
  }

  @ApiGetChatUnreadCounts()
  @Get(':roomId/chat/unreads')
  async getUnreadCounts(
    @Param('roomId', ParseObjectIdPipe) roomId: mongoose.Types.ObjectId,
    @Query('after', ParseIntPipe) after: number,
  ) {
    return this.chatService.getUnreadCounts(roomId, after);
  }
}
