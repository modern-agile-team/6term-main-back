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
import { ChatService } from '../services/chat.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { PostChatDto } from '../dto/post-chat.dto';
import mongoose from 'mongoose';
import { FileInterceptor } from '@nestjs/platform-express';
import { Users } from 'src/common/decorators/user.decorator';
import { User } from 'src/users/entities/user.entity';

@ApiTags('CHAT')
@Controller('chat')
@UsePipes(ValidationPipe)
export class ChatController {
  constructor(private chatService: ChatService) {}

  @ApiOperation({ summary: '채팅방 전체 조회' })
  @Get('room')
  async getChatRooms(@Users() user: User) {
    return await this.chatService.getChatRooms(user.id);
  }

  @ApiOperation({ summary: '채팅방 단일 조회' })
  @Get('room/:roomId')
  async getOneChatRoom(
    @Users() user: User,
    @Param('roomId') roomId: mongoose.Types.ObjectId,
  ) {
    return await this.chatService.getOneChatRoom(user.id, roomId);
  }

  @ApiOperation({ summary: '채팅방 생성' })
  @Post('room/:guestId')
  async createChatRoom(
    @Users() user: User,
    @Param('guestId', ParseIntPipe) guestId: number,
  ) {
    return await this.chatService.createChatRoom(user.id, guestId);
  }

  @ApiOperation({ summary: '해당 채팅방 삭제' })
  @Delete('room/:roomId')
  async deleteChatRoom(
    @Users() user: User,
    @Param('roomId') roomId: mongoose.Types.ObjectId,
  ) {
    return await this.chatService.deleteChatRoom(user.id, roomId);
  }

  @ApiOperation({ summary: '특정 채팅방 채팅 전체 조회' })
  @Get(':roomId')
  async getChats(@Param('roomId') roomId: mongoose.Types.ObjectId) {
    return await this.chatService.getChats(roomId);
  }

  @ApiOperation({ summary: '특정 채팅방 채팅 생성' })
  @Post(':receiverId')
  async createChat(
    @Users() user: User,
    @Param('receiverId', ParseIntPipe) receiverId: number,
    @Body() body: PostChatDto,
  ) {
    return this.chatService.createChat(
      body.chatroom_id,
      body.content,
      user.id,
      receiverId,
    );
  }

  @ApiOperation({ summary: '특정 채팅방 채팅 이미지 생성' })
  @Post('/image/:roomId/:receiverId')
  @UseInterceptors(FileInterceptor('file'))
  async createChatImage(
    @Param('roomId') roomId: mongoose.Types.ObjectId,
    @Users() user: User,
    @Param('receiverId') receiverId: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.chatService.createChatImage(roomId, user.id, receiverId, file);
  }
}
