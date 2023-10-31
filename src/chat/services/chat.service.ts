import { ChatRepository } from '../repositories/chat.repository';
import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ChatRoom } from '../schemas/chat-room.schemas';
import * as mongoose from 'mongoose';
import { S3Service } from 'src/common/s3/s3.service';
import { NotificationService } from './notification.service';
import { ChatNotification } from '../schemas/chat-notifiation.schemas';
import { Subject, catchError, map } from 'rxjs';
import { Chat } from '../schemas/chat.schemas';

@Injectable()
export class ChatService {
  private readonly logger = new Logger(ChatService.name);
  private readonly subject = new Subject();
  constructor(
    private readonly s3Service: S3Service,
    private readonly notificationService: NotificationService,
    private readonly chatRepository: ChatRepository,
    @InjectModel(ChatRoom.name)
    private readonly chatRoomModel: mongoose.Model<ChatRoom>,
    @InjectModel(Chat.name)
    private readonly chatModel: mongoose.Model<Chat>,
    @InjectModel(ChatNotification.name)
    private readonly chatNotificationModel: mongoose.Model<ChatNotification>,
  ) {}

  notificationListener() {
    return (
      this.subject
        .asObservable()
        .pipe(
          map((notification: Notification) => JSON.stringify(notification)),
        ),
      catchError((err) => {
        this.logger.error('notificationListener : ' + err.message);
        throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
      })
    );
  }
  async getChatRooms(myId: number) {
    const chatRoom = await this.chatRepository.getChatRooms(myId);

    if (!chatRoom.length) {
      throw new NotFoundException('해당 유저가 속한 채팅방이 없습니다.');
    }

    return chatRoom;
  }

  async getOneChatRoom(myId: number, roomId: mongoose.Types.ObjectId) {
    const returnedRoom = await this.chatRepository.getOneChatRoom(myId, roomId);

    if (!returnedRoom) {
      throw new NotFoundException('해당 유저가 속한 채팅방이 없습니다.');
    }

    return returnedRoom;
  }

  async createChatRoom(myId: number, guestId: number) {
    try {
      const isChatRoom = await this.chatRoomModel.findOne({
        $or: [
          { $and: [{ host_id: myId }, { guest_id: guestId }] },
          { $and: [{ host_id: guestId }, { guest_id: myId }] },
        ],
      });

      if (isChatRoom) {
        throw new ConflictException('해당 유저들의 채팅방이 이미 존재합니다.');
      }

      return await this.chatRepository.createChatRoom(myId, guestId);
    } catch (error) {
      console.error('채팅룸 생성 실패: ', error);
      if (error.code === 11000) {
        throw new ConflictException(
          '채팅룸 생성 실패. 서버에서 에러가 발생했습니다.',
        );
      }
      throw error;
    }
  }

  async deleteChatRoom(myId: number, roomId: mongoose.Types.ObjectId) {
    const chatRoom = await this.chatRoomModel.findOne({
      $and: [{ _id: roomId }, { deleted_at: null }],
    });

    if (!chatRoom) {
      throw new NotFoundException('해당 채팅룸이 없습니다.');
    }

    const isUser = await this.chatRoomModel.find({
      $and: [
        { $or: [{ host_id: myId }, { guest_id: myId }] },
        { _id: chatRoom.id },
      ],
    });

    if (!isUser.length) {
      throw new NotFoundException('해당 유저는 채팅방에 속해있지 않습니다.');
    }

    return this.chatRepository.deleteChatRoom(roomId);
  }

  async getChats(roomId: mongoose.Types.ObjectId) {
    const returnedChat = await this.chatRepository.getChats(roomId);

    if (!returnedChat.length) {
      throw new NotFoundException(
        '해당 채팅룸이 없거나 채팅이 존재하지 않습니다.',
      );
    }

    return returnedChat;
  }

  async createChat({ roomId, content, senderId, receiverId }) {
    await this.getOneChatRoom(senderId, roomId);

    const isChatRoom = await this.chatRoomModel.findOne({
      $or: [
        {
          $and: [{ host_id: senderId }, { guest_id: receiverId }],
        },
        {
          $and: [{ host_id: receiverId }, { guest_id: senderId }],
        },
      ],
    });

    if (!isChatRoom) {
      throw new NotFoundException('채팅을 전송할 유저가 채팅방에 없습니다');
    }

    const returnedChat = await this.chatRepository.createChat(
      roomId,
      content,
      senderId,
      receiverId,
    );

    const chat = {
      content: returnedChat.content,
      sender: returnedChat.sender,
      receiver: returnedChat.receiver,
    };

    const notification = await new this.chatNotificationModel({
      chat_id: returnedChat.id,
      sender: returnedChat.sender,
      receiver: returnedChat.receiver,
    }).save();

    // send notification
    if (notification) this.subject.next(notification);

    return chat;
  }

  async createChatImage(
    roomId: mongoose.Types.ObjectId,
    myId: number,
    receiverId: number,
    file: Express.Multer.File,
  ) {
    await this.getOneChatRoom(myId, roomId);

    const isChatRoom = await this.chatRoomModel.findOne({
      $or: [
        {
          $and: [{ host_id: myId }, { guest_id: receiverId }],
        },
        {
          $and: [{ host_id: receiverId }, { guest_id: myId }],
        },
      ],
    });

    if (!isChatRoom) {
      throw new NotFoundException('채팅을 전송할 유저가 채팅방에 없습니다');
    }

    const imageUrl = await this.s3Service.ChatImageUpload(file, myId);

    return this.chatRepository.createChatImage(
      roomId,
      myId,
      receiverId,
      imageUrl.url,
    );
  }

  async findChatImage({ roomId, content, senderId, receiverId }) {
    const isChatAndUsers = await this.chatModel.findOne({
      $and: [
        { chatroom_id: roomId },
        { sender: senderId },
        { receiver: receiverId },
        { content: content },
      ],
    });

    if (!isChatAndUsers) {
      throw new NotFoundException('해당 채팅을 찾지 못했습니다.');
    }

    return isChatAndUsers;
  }

  async getUnreadCounts(roomId: mongoose.Types.ObjectId, after: number) {
    const returnedRoom = await this.chatRoomModel.findOne({ _id: roomId });
    if (!returnedRoom) {
      throw new NotFoundException('해당 채팅 룸을 찾지 못했습니다.');
    }
    return this.chatRepository.getUnreadCounts(roomId, after);
  }
}
