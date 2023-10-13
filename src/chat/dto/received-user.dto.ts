import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class ReceivedUserDto {
  @ApiProperty({
    example: '1',
    description: '요청을 받는 유저 아이디',
  })
  @IsNumber()
  @IsNotEmpty()
  receiverId: number;
}
