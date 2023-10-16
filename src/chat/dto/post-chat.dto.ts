import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class PostChatDto {
  @ApiProperty({
    example: '안녕하세요',
    description: '채팅 내용',
  })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({
    example: '1',
    description: '채팅을 받는 유저 아이디',
  })
  @IsNumber()
  @IsNotEmpty()
  receiverId: number;
}
