import { Controller, Get, Param } from "@nestjs/common";
import { UserService } from "../services/user.service";
import { ApiGetUserInfo } from "../swagger-decorators/get-user-info.decorator";
import { ApiTags } from "@nestjs/swagger";

@Controller('user')
@ApiTags('user API')
export class UserController {
  constructor(
    private readonly userService: UserService,
  ) {}

  @ApiGetUserInfo()
  @Get('info/:user_id')
  async getUserInfo(@Param('user_id') userId: number) {
    return this.userService.getUserInfo(userId);
  }
}