import { IsNumber, IsString } from 'class-validator';

// import { IsString, IsInstance, isNumber } from 'class-validator';
// import { User } from 'src/users/entities/user.entity';

export class CreateBoardDto {
  @IsString()
  head: string;

  @IsString()
  body: string;

  @IsString()
  main_category: string;

  @IsString()
  sub_category: string;

  // @IsInstance(User)
  // userId: User;
  @IsNumber()
  userId: number;
}
