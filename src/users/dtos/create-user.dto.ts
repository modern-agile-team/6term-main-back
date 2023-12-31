import { IsBoolean, IsEmail, IsString } from "class-validator";

export class CreateUSerDto {
  @IsString()
  readonly provider: string;

  @IsString()
  readonly name: string;

  @IsEmail()
  readonly email: string;

  @IsString()
  readonly gender: string;

  @IsBoolean()
  readonly admin: boolean;
}