import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UploadedFile,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ChatService } from './chat.service';
// import { ChatRoom } from './schemas/chat-room.schemas';
// import { Chat } from './schemas/chat.schemas';
// import { ChatNotification } from './schemas/chat-notifiation.schemas';
// import { ChatImage } from './schemas/chat-image.schemas';
import { ApiOperation } from '@nestjs/swagger';
// import { Users } from 'src/common/decorators/user.decorator';
// import { User } from 'src/users/entities/user.entity';
import { PostChatDto } from './dto/post-chat.dto';
import { CreateRoomDto } from './dto/create-room.dto';
import mongoose from 'mongoose';
import { FileInterceptor } from '@nestjs/platform-express';
import { S3Service } from 'src/common/s3/s3.service';

@Controller('chat')
@UsePipes(ValidationPipe)
export class ChatController {
  constructor(
    private chatService: ChatService,
    private s3Service: S3Service,
  ) {}

  @ApiOperation({ summary: '채팅방 전체 조회' })
  @Get('room/:testUser')
  // async createChatRoom(@Users() user: User) {
  async getChatRooms(@Param('testUser', ParseIntPipe) testUser: number) {
    return await this.chatService.getChatRooms(testUser);
    // return await this.chatService.createChatRoom(user.id);
  }

  @ApiOperation({ summary: '채팅방 단일 조회' })
  @Get('room/:testUser/:roomId')
  // async createChatRoom(@Users() user: User) {
  async getOneChatRoom(
    @Param('testUser', ParseIntPipe) testUser: number,
    @Param('roomId') roomId: mongoose.Types.ObjectId,
  ) {
    return await this.chatService.getOneChatRoom(testUser, roomId);
    // return await this.chatService.createChatRoom(user.id);
  }

  @ApiOperation({ summary: '채팅방 생성' })
  @Post('room/:testUser')
  // async createChatRoom(@Users() user: User) {
  async createChatRoom(
    @Param('testUser', ParseIntPipe) testUser: number,
    @Body('guestId', ParseIntPipe) guestId: number,
  ) {
    return await this.chatService.createChatRoom(testUser, guestId);
    // return await this.chatService.createChatRoom(user.id);
  }

  @ApiOperation({ summary: '해당 채팅방 삭제' })
  @Delete('room/:testUser/:roomId')
  // async createChatRoom(@Users() user: User) {
  async deleteChatRoom(
    @Param('testUser', ParseIntPipe) testUser: number,
    @Param('roomId') roomId: mongoose.Types.ObjectId,
  ) {
    return await this.chatService.deleteChatRoom(testUser, roomId);
    // return await this.chatService.createChatRoom(user.id);
  }

  @ApiOperation({ summary: '특정 채팅방 채팅 전체 조회' })
  @Get(':roomId')
  // async createChatRoom(@Users( ) user: User) {
  async getChats(@Param('roomId') roomId: mongoose.Types.ObjectId) {
    return await this.chatService.getChats(roomId);
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

  @ApiOperation({ summary: '특정 채팅방 채팅 생성' })
  @Post(':roomId/:senderId/:receiverId')
  @UseInterceptors(FileInterceptor('file'))
  async createChatImage(
    @Param('roomId') roomId: mongoose.Types.ObjectId,
    @Param('senderId') senderId: number,
    @Param('receiverId') receiverId: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    // const userId = senderId;
    const { url, key } = await this.s3Service.imgUpload(file, senderId);
    return this.chatService.createChatImage(roomId, senderId, receiverId, url);
  }
}
