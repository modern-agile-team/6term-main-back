import { Body, Controller, Get, Post } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatRoom } from './schemas/chat-room.schemas';
import { Chat } from './schemas/chat.schemas';
import { ChatNotification } from './schemas/chat-notifiation.schemas';
import { ChatImage } from './schemas/chat-image.schemas';

@Controller('chat')
export class ChatController {
    constructor(private chatService: ChatService) {}

    // @Get()
    // async getAllChats(): Promise<ChatRoom[]> {
    //     return await this.chatService.findAll();
    // }

    @Post()
    async createChat(
        @Body() 
        chat
    ): Promise<ChatImage> {
        return this.chatService.create(chat);
    }
}
