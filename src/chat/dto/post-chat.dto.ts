import { PickType } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { Chat } from '../schemas/chat.schemas';

export class PostChatDto extends PickType(Chat, ['chatroom_id']) {
  @IsString()
  @IsNotEmpty()
  content: string;
}
