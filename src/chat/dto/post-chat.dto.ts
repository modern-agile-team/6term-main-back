import { ApiProperty } from '@nestjs/swagger';
import {
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import mongoose from 'mongoose';

export class PostChatDto {
  @IsMongoId()
  @IsNotEmpty()
  @ApiProperty({
    example: '650bde3798dd4c34439c30dc',
    description: '채팅을 전송하는 채팅방 id',
  })
  roomId: mongoose.Types.ObjectId;

  @ApiProperty({
    example: '안녕하세요',
    description: '채팅 내용',
  })
  @IsString()
  @IsOptional()
  content: string;

  @ApiProperty({
    example: '1',
    description: '채팅을 보내는 유저 아이디',
  })
  @IsNumber()
  @IsNotEmpty()
  senderId: number;

  @ApiProperty({
    example: '2',
    description: '채팅을 받는 유저 아이디',
  })
  @IsNumber()
  @IsNotEmpty()
  receiverId: number;

  @ApiProperty({
    example: 'Key: file, Value: asd.png',
    description: 'FormData. 이미지 파일',
  })
  @IsOptional()
  imageUrl: FormData;
}
