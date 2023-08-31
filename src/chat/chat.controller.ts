import { Controller, Get } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatRoom } from './schemas/chat-room.schemas';

@Controller('chat')
export class ChatController {
    constructor(private chatService: ChatService) {}

    @Get()
    async getAllChats(): Promise<ChatRoom[]> {
        return await this.chatService.findAll();
    }
}
