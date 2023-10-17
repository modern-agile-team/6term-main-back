import { IsNumber, IsString } from 'class-validator';

export class CreateBoardImageDto {
  @IsNumber()
  boardId: number;

  @IsString()
  imageUrl: string;
}
