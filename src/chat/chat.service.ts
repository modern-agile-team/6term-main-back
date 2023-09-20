import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ChatRoom } from './schemas/chat-room.schemas';
import * as mongoose from 'mongoose';
import { Chat } from './schemas/chat.schemas';
import { ChatNotification } from './schemas/chat-notifiation.schemas';
import { ChatImage } from './schemas/chat-image.schemas';

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(ChatRoom.name)
    private chatRoomModel: mongoose.Model<ChatRoom>,
  ) {}

  // async findAll(): Promise<ChatRoom[]> {
  //     const chatRooms = await this.chatRoomModel.find()
  //     return chatRooms;
  // }

  async createChatRoom(content: string, myId): Promise<ChatRoom> {
    const res = await this.chatRoomModel.create(ChatRoom);
  }
}
