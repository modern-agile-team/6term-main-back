import { Injectable, NotFoundException } from '@nestjs/common';
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
  async getChatRooms(testUser: number) {
    return await this.chatRoomModel
      .find({
        $or: [{ host_id: testUser }, { guest_id: testUser }],
        deleted_at: null,
      })
      .exec();
  }

  async getOneChatRoom(testUser: number, roomId: mongoose.Types.ObjectId) {
    const returnedRoom = await this.chatRoomModel
      .find({
        $and: [
          {
            $or: [{ host_id: testUser }, { guest_id: testUser }],
          },
          { deleted_at: null },
          { _id: roomId },
        ],
      })
      .exec();
    if (!returnedRoom) {
      throw new NotFoundException('해당 ChatRoom이 존재하지 않습니다.');
    }
    return returnedRoom;
  }
  async createChatRoom(myId: number, guestId: number) {
    const chatRoomReturned = await this.chatRoomModel.create({
      host_id: myId,
      guest_id: guestId,
    });
    console.log(chatRoomReturned.id);
    return chatRoomReturned;
  }

  async getChats(roomId: mongoose.Types.ObjectId) {
    return await this.chatModel.find({ chatroom_id: roomId }).exec();
  }

  async createChat(
    roomId: mongoose.Types.ObjectId,
    content: string,
    myId: number,
    receiverId: number,
  ) {
    const exception = await this.getOneChatRoom(myId, roomId);
    if (!exception.length)
      throw new NotFoundException('해당 ChatRoom이 없습니다.');
    const chatReturned = await this.chatModel.create({
      chatroom_id: roomId,
      content: content,
      sender: myId,
      receiver: receiverId,
    });
    const chat = {
      content: chatReturned.content,
      sender: chatReturned.sender,
      receiver: chatReturned.receiver,
    };
    const socketRoomId = chatReturned.chatroom_id.toString();
    this.eventsGateway.server
      .to(`/ch${socketRoomId}`)
      .emit('message', chat.content, 'login', chat.sender);
    // this.eventsGateway.server.to('/ch123').emit('message', chat);
    return chat;
  }
}
