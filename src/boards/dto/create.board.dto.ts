import { IsString, IsNumber, IsInstance } from 'class-validator';
import { User } from 'src/users/entities/user.entity';

export class CreateBoardDto {
  @IsString()
  head: string;

  @IsString()
  body: string;

  @IsNumber()
  main_category: string;

  @IsNumber()
  sub_category: string;

  @IsInstance(User)
  userId: User;
}
