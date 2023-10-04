import { IsString, IsInstance } from 'class-validator';
import { Board } from '../entities/board.entity';

export class CreateBoardImageDto {
  @IsInstance(Board)
  boardId: Board;

  @IsString()
  image_url: string;
}
