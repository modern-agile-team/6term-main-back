import { Controller, Get, Param } from "@nestjs/common";
import { UserService } from "../services/user.service";

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
  ) {}

  @Get('info/:user_id')
  async getUserInfo(@Param('user_id') userId: number) {
    return this.userService.getUserInfo(userId);
  }
}