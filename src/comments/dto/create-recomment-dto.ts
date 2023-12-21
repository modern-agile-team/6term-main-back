import { IsString } from 'class-validator';

export class CreateReCommentDto {
  @IsString()
  content: string;
}
