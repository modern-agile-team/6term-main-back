import { ChatRepository } from '../repositories/chat.repository';
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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

  async getChatRooms(myId: number) {
    try {
      const chatRoom = await this.chatRepository.getChatRooms(myId);

      if (!chatRoom.length) {
        throw new NotFoundException('해당 유저가 속한 채팅방이 없습니다.');
      }

      return chatRoom;
    } catch (error) {
      console.error('채팅룸 조회 실패', error);
      throw error;
    }
  }

  async getOneChatRoom(myId: number, roomId: mongoose.Types.ObjectId) {
    try {
      const returnedRoom = await this.chatRepository.getOneChatRoom(
        myId,
        roomId,
      );

      if (!returnedRoom) {
        throw new NotFoundException('해당 유저가 속한 채팅방이 없습니다.');
      }

      return returnedRoom;
    } catch (error) {
      console.error('채팅룸 단일 조회 실패: ', error);
      if (error instanceof mongoose.Error.CastError) {
        throw new NotFoundException(
          '올바른 ObjectId 형식이 아니거나, 존재하지 않습니다.',
        );
      }
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
      if (error.code === 11000) {
        throw new ConflictException('중복된 id값이 이미 존재합니다.');
      }
      throw error;
    }
  }

  async deleteChatRoom(myId: number, roomId: mongoose.Types.ObjectId) {
    try {
      const chatRoom = await this.chatRoomModel
        .findById({
          _id: roomId,
        })
        .exec();

      const isUser = await this.chatRoomModel
        .find({
          $and: [
            { $or: [{ host_id: myId }, { guest_id: myId }] },
            { _id: roomId },
          ],
        })
        .exec();

      if (!isUser.length) {
        throw new NotFoundException('해당 유저는 채팅방에 속해있지 않습니다.');
      }
      const returnedChatRoom = await this.chatRepository.deleteChatRoom(
        chatRoom.id,
      );

      return returnedChatRoom;
    } catch (error) {
      console.error('채팅룸 삭제 실패: ', error);
      if (error instanceof mongoose.Error.CastError) {
        throw new NotFoundException(
          '올바른 ObjectId 형식이 아니거나, 존재하지 않습니다.',
        );
      }
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
