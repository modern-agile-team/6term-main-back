import { ChatRepository } from '../repositories/chat.repository';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ChatRoom } from '../schemas/chat-room.schemas';
import * as mongoose from 'mongoose';
import { Chat } from '../schemas/chat.schemas';
import { EventsGateway } from 'src/events/events.gateway';
import { ChatImage } from '../schemas/chat-image.schemas';
import { S3Service } from 'src/common/s3/s3.service';

@Injectable()
export class ChatService {
  constructor(
    private readonly s3Service: S3Service,
    private readonly chatRepository: ChatRepository,
    @InjectModel(ChatRoom.name)
    private readonly chatRoomModel: mongoose.Model<ChatRoom>,
    @InjectModel(Chat.name)
    private readonly chatModel: mongoose.Model<Chat>,
    @InjectModel(ChatImage.name)
    private readonly chatImageModel: mongoose.Model<ChatImage>,
    private readonly eventsGateway: EventsGateway,
  ) {}

  async getChatRooms(testUser: number) {
    try {
      const chatRoom = await this.chatRepository.getChatRooms(testUser);

      if (!chatRoom.length) {
        throw new NotFoundException('해당 유저가 속한 채팅방이 없습니다.');
      }

      return chatRoom;
    } catch (error) {
      console.error('채팅룸 조회 실패', error);
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
      console.error('채팅룸 단일 조회 실패: ', error);
      throw error;
    }
  }
  async createChatRoom(myId: number, guestId: number) {
    try {
      const chatRoomReturned = await this.chatRepository.createChatRoom(
        myId,
        guestId,
      );

      return chatRoomReturned;
    } catch (error) {
      console.error('채팅룸 생성 실패: ', error);
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
      console.error('채팅룸 삭제 실패: ', error);
      throw error;
    }
  }

  async getChats(roomId: mongoose.Types.ObjectId) {
    try {
      const returnedChat = await this.chatRepository.getChats(roomId);

      if (!returnedChat.length) {
        throw new NotFoundException('해당 채팅방이 없습니다.');
      }

      return returnedChat;
    } catch (error) {
      console.error('채팅 조회 실패: ', error);
      throw error;
    }
  }

  async createChat(
    roomId: mongoose.Types.ObjectId,
    content: string,
    myId: number,
    receiverId: number,
  ) {
    try {
      await this.getOneChatRoom(myId, roomId);

      const returnedChat = await this.chatRepository.createChat(
        roomId,
        content,
        myId,
        receiverId,
      );

      const chat = {
        content: returnedChat.content,
        sender: returnedChat.sender,
        receiver: returnedChat.receiver,
      };

      const socketRoomId = returnedChat.chatroom_id.toString();
      // this.eventsGateway.handleConnection(user);
      this.eventsGateway.server.to(`ch-${socketRoomId}`).emit('message', chat);

      // this.eventsGateway.server.to('/ch123').emit('message', chat);
      return chat;
    } catch (error) {
      console.error('채팅 생성 실패: ', error);
      throw error;
    }
  }

  async createChatImage(
    roomId: mongoose.Types.ObjectId,
    myId: number,
    receiverId: number,
    file: Express.Multer.File,
  ) {
    try {
      await this.getOneChatRoom(myId, roomId);

      const imageUrl = await this.s3Service.imgUpload(file, myId);

      const returnedChat = await this.chatRepository.createChatImage(
        roomId,
        myId,
        receiverId,
        imageUrl.url,
      );

      const chat = {
        content: returnedChat.content,
        sender: returnedChat.sender,
        receiver: returnedChat.receiver,
      };

      const socketRoomId = returnedChat.chatroom_id.toString();
      this.eventsGateway.server.to(`ch-${socketRoomId}`).emit('message', chat);

      return chat;
    } catch (error) {
      console.error('채팅 이미지 생성 실패: ', error);
      throw error;
    }
  }
}