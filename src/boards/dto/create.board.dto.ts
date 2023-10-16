import { IsString } from 'class-validator';

export class CreateBoardDto {
  @IsString()
  head: string;

  @IsString()
  body: string;

  @IsString()
  main_category: string;

  @IsString()
  sub_category: string;
}
