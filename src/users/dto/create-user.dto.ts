import { IsEmail, IsString } from "class-validator";

export class CreateUSerDto {
  @IsString()
  readonly name: string;

  @IsEmail()
  readonly email: string;

  @IsString()
  readonly gender: string;
}