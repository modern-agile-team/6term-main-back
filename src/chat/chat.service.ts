import { Injectable } from '@nestjs/common';
<<<<<<< HEAD

@Injectable()
export class ChatService {}
=======
import { InjectModel } from '@nestjs/mongoose';
import { ChatRoom } from './schemas/chat-room.schemas';
import * as mongoose from 'mongoose';
import { Chat } from './schemas/chat.schemas';
import { ChatNotification } from './schemas/chat-notifiation.schemas';
import { ChatImage } from './schemas/chat-image.schemas';

@Injectable()
export class ChatService {
    constructor(
        @InjectModel(ChatNotification.name)
        private chatRoomModel: mongoose.Model<ChatNotification>
    ) {}


    // async findAll(): Promise<ChatRoom[]> {
    //     const chatRooms = await this.chatRoomModel.find()
    //     return chatRooms;
    // }

    async create(chatroom: ChatNotification): Promise<ChatNotification> {
        const res = await this.chatRoomModel.create(chatroom)
        return res;
    }
}
>>>>>>> bdb9578c653be91200ea0d43c4789fc699bafd80
