import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ChatRoom } from '../schemas/chat-room.schemas';
import { Chat } from '../schemas/chat.schemas';
import { ChatImage } from '../schemas/chat-image.schemas';
import mongoose from 'mongoose';

@Injectable()
export class ChatRepository {
  constructor(
    @InjectModel(ChatRoom.name)
    private readonly chatRoomModel: mongoose.Model<ChatRoom>,
    @InjectModel(Chat.name)
    private readonly chatModel: mongoose.Model<Chat>,
    @InjectModel(ChatImage.name)
    private readonly chatImageModel: mongoose.Model<ChatImage>,
  ) {}

  async getChatRooms(testUser: number) {
    const chatRoom = await this.chatRoomModel
      .find({
        $and: [
          { $or: [{ host_id: testUser }, { guest_id: testUser }] },
          { deleted_at: null },
        ],
      })
      .exec();
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
    try {
      const chatRoomReturned = await this.chatRoomModel.create({
        host_id: myId,
        guest_id: guestId,
      });
      return chatRoomReturned;
    } catch (error) {
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
}
