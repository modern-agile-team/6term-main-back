import { ChatRepository } from '../repositories/chat.repository';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ChatRoom } from '../schemas/chat-room.schemas';
import * as mongoose from 'mongoose';
import { Chat } from '../schemas/chat.schemas';
import { EventsGateway } from 'src/events/events.gateway';
import { ChatImage } from '../schemas/chat-image.schemas';

@Injectable()
export class ChatService {
  constructor(
    private readonly chatRepository: ChatRepository,
    @InjectModel(ChatRoom.name)
    private readonly chatRoomModel: mongoose.Model<ChatRoom>,
    @InjectModel(Chat.name)
    private readonly chatModel: mongoose.Model<Chat>,
    @InjectModel(ChatImage.name)
    private readonly chatImageModel: mongoose.Model<ChatImage>,
    private readonly eventsGateway: EventsGateway,
  ) {}

  // async findAll(): Promise<ChatRoom[]> {
  //     const chatRooms = await this.chatRoomModel.find()
  //     return chatRooms;
  // }
  async getChatRooms(testUser: number) {
    try {
      const chatRoom = await this.chatRepository.getChatRooms(testUser);

      if (!chatRoom.length) {
        throw new NotFoundException('해당 유저가 속한 채팅방이 없습니다.');
      }

      return chatRoom;
    } catch (error) {
      throw error;
    }
  }

  async getOneChatRoom(testUser: number, roomId: mongoose.Types.ObjectId) {
    try {
      const returnedRoom = await this.chatRepository.getOneChatRoom(
        testUser,
        roomId,
      );
      return returnedRoom;
    } catch (error) {
      throw error;
    }
  }
  async createChatRoom(myId: number, guestId: number) {
    try {
      const chatRoomReturned = await this.createChatRoom(myId, guestId);
      return chatRoomReturned;
    } catch (error) {
      throw error;
    }
  }

  async deleteChatRoom(myId: number, roomId: mongoose.Types.ObjectId) {
    try {
      const returnedChatRoom = await this.chatRepository.deleteChatRoom(
        myId,
        roomId,
      );
      return returnedChatRoom;
    } catch (error) {
      throw new Error();
    }
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
    await this.getOneChatRoom(myId, roomId);
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
    // this.eventsGateway.handleConnection(user);
    this.eventsGateway.server.to(`ch-${socketRoomId}`).emit('message', chat);

    // this.eventsGateway.server.to('/ch123').emit('message', chat);
    return chat;
  }

  async createChatImage(
    roomId: mongoose.Types.ObjectId,
    myId: number,
    receiverId: number,
    imageUrl: string,
  ) {
    await this.getOneChatRoom(myId, roomId);
    const chatReturned = await this.chatModel.create({
      chatroom_id: roomId,
      sender: myId,
      receiver: receiverId,
      content: imageUrl,
    });
    await this.chatImageModel.create({
      chat_id: chatReturned.id,
      image_url: chatReturned.content,
    });
    const chat = {
      content: chatReturned.content,
      sender: chatReturned.sender,
      receiver: chatReturned.receiver,
    };
    const socketRoomId = await chatReturned.chatroom_id.toString();
    this.eventsGateway.server.to(`ch-${socketRoomId}`).emit('message', chat);
    return chat;
  }
}