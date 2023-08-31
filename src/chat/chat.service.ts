import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ChatRoom } from './schemas/chat-room.schemas';
import * as mongoose from 'mongoose';

@Injectable()
export class ChatService {
    constructor(
        @InjectModel(ChatRoom.name)
        private chatRoomModel: mongoose.Model<ChatRoom>
    ) {}


    async findAll(): Promise<ChatRoom[]> {
        const chatRooms = await this.chatRoomModel.find()
        return chatRooms;
    }
}
