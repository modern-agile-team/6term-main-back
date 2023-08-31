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
        @InjectModel(ChatImage.name)
        private chatRoomModel: mongoose.Model<ChatImage>
    ) {}


    // async findAll(): Promise<ChatRoom[]> {
    //     const chatRooms = await this.chatRoomModel.find()
    //     return chatRooms;
    // }

    async create(chatroom: ChatImage): Promise<ChatImage> {
        const res = await this.chatRoomModel.create(chatroom)
        return res;
    }
}
