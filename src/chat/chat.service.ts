import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ChatRoom } from './schemas/chat-room.schemas';
import * as mongoose from 'mongoose';
import { Chat } from './schemas/chat.schemas';
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
    const chatRoom = await this.chatRoomModel
      .find({
        $and: [
          { $or: [{ host_id: testUser }, { guest_id: testUser }] },
          { deleted_at: null },
        ],
      })
      .exec();
    if (!chatRoom.length) {
      throw new NotFoundException('해당 유저가 속한 채팅방이 없습니다.');
    }

    return chatRoom;
  }

  async getOneChatRoom(testUser: number, roomId: mongoose.Types.ObjectId) {
    try {
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

      return returnedRoom;
    } catch (error) {
      if (error instanceof mongoose.Error.CastError) {
        throw new NotFoundException(
          '올바른 ObjectId 형식이 아니거나, 존재하지 않습니다.',
        );
      }
    }
  }
  async createChatRoom(myId: number, guestId: number) {
    const chatRoomReturned = await this.chatRoomModel.create({
      host_id: myId,
      guest_id: guestId,
    });
    return chatRoomReturned;
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

      return await this.chatRoomModel
        .findByIdAndUpdate(chatRoom.id, {
          deleted_at: new Date(),
        })
        .exec();
    } catch (error) {
      if (error instanceof mongoose.Error.CastError) {
        throw new NotFoundException(
          '올바른 ObjectId 형식이 아니거나, 존재하지 않습니다.',
        );
      }
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
    user,
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

  // async createChatImage(
  //   roomId: mongoose.Types.ObjectId,
  //   myId: number,
  //   receiverId: number,
  //   imageUrl: string,
  // ) {
  //   await this.getOneChatRoom(myId, roomId);
  //   const imageUrlReturned = await this.chatI;
  //   const chatReturned = await this.chatModel();
  // }
}
