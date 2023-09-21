import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ChatRoom } from './schemas/chat-room.schemas';
import * as mongoose from 'mongoose';
import { Chat } from './schemas/chat.schemas';
import { ChatNotification } from './schemas/chat-notifiation.schemas';
import { ChatImage } from './schemas/chat-image.schemas';
import { EventsGateway } from 'src/events/events.gateway';

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(ChatRoom.name)
    private readonly chatRoomModel: mongoose.Model<ChatRoom>,
    @InjectModel(Chat.name)
    private readonly chatModel: mongoose.Model<Chat>,
    private readonly eventsGateway: EventsGateway,
  ) {}

  // async findAll(): Promise<ChatRoom[]> {
  //     const chatRooms = await this.chatRoomModel.find()
  //     return chatRooms;
  // }

  async createChatRoom(myId: number, guestId: number) {
    const chatRoomReturned = await this.chatRoomModel.create({
      host_id: myId,
      guest_id: guestId,
    });
    console.log(chatRoomReturned.id);
    return chatRoomReturned;
  }

  async createChat(
    roomId: number,
    content: string,
    myId: number,
    receiverId: number,
  ) {
    const chatReturned = await this.chatModel.create({});
  }
}
