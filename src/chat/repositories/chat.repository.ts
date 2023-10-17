import { Injectable } from '@nestjs/common';
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

  async getChatRooms(myId: number) {
    return this.chatRoomModel.find({
      $and: [
        { $or: [{ host_id: myId }, { guest_id: myId }] },
        { deleted_at: null },
      ],
    });
  }

  async getOneChatRoom(myId: number, roomId: mongoose.Types.ObjectId) {
    return this.chatRoomModel.findOne({
      $and: [
        {
          $or: [{ host_id: myId }, { guest_id: myId }],
        },
        { deleted_at: null },
        { _id: roomId },
      ],
    });
  }

  async createChatRoom(myId: number, guestId: number) {
    return this.chatRoomModel.create({
      host_id: myId,
      guest_id: guestId,
    });
  }

  async deleteChatRoom(roomId: mongoose.Types.ObjectId) {
    await this.chatRoomModel.findByIdAndUpdate(roomId, {
      deleted_at: new Date(),
    });

    return { success: true, msg: '게시글 삭제 성공' };
  }

  async getChats(roomId: mongoose.Types.ObjectId) {
    return this.chatModel.find({ chatroom_id: roomId });
  }

  async createChat(
    roomId: mongoose.Types.ObjectId,
    content: string,
    myId: number,
    receiverId: number,
  ) {
    return this.chatModel.create({
      chatroom_id: roomId,
      content: content,
      sender: myId,
      receiver: receiverId,
    });
  }

  async createChatImage(
    roomId: mongoose.Types.ObjectId,
    myId: number,
    receiverId: number,
    imageUrl: string,
  ) {
    const returnedChat = await this.chatModel.create({
      chatroom_id: roomId,
      sender: myId,
      receiver: receiverId,
      content: imageUrl,
    });

    await this.chatImageModel.create({
      chat_id: returnedChat.id,
      image_url: returnedChat.content,
    });

    return returnedChat;
  }
}
