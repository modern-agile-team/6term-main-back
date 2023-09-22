import { IsString, IsNumber } from 'class-validator';

export class CreateBoardDto {
  @IsString()
  readonly head: string;

  @IsString()
  readonly body: string;

  @IsNumber()
  readonly main_category: number;

  @IsNumber()
  readonly sub_category: number;
}
