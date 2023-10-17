import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class ReceivedUserDto {
  @ApiProperty({
    example: '1',
    description: '요청을 받는 유저 아이디',
  })
  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  receiverId: number;
}
