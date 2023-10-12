import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

import mongoose from 'mongoose';

export class PostChatDto {
  @ApiProperty({
    example: '안녕하세요',
    description: '채팅 내용',
  })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({
    example: '650bde3798dd4c34439c30dc',
    description: 'chatroom 아이디',
  })
  chatroom_id: mongoose.Types.ObjectId;
}
