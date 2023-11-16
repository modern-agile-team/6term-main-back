import { IsString } from 'class-validator';

export class UpdateReCommentDto {
  @IsString()
  content: string;
}
