import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { UserService } from '../services/user.service';
import { ApiHeader, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { JwtAccessTokenGuard } from 'src/config/guards/jwt-access-token.guard';
import { GetUserId } from 'src/common/decorators/get-userId.decorator';
import { ApiGetMyInfo } from '../swagger-decorators/get-my-info-decorator';

@Controller('user')
@ApiTags('user API')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiGetMyInfo()
  @UseGuards(JwtAccessTokenGuard)
  @Get('my-info')
  async getMyInfo(@GetUserId() userId: number) {
    return this.userService.getMyInfo(userId);
  }

  @UseGuards(JwtAccessTokenGuard)
  @ApiParam({ name: 'targetId', example: 1, required: true })
  @ApiHeader({
    name: 'access_token',
    example: '액세스 토큰값',
    required: true,
  })
  @ApiOperation({
    summary: '기존 my-info + owner',
    description:
      '유저의 액세스 토큰의 id와 조회하려는 유저의 id를 비교해서 owner 여부를 포함해서 알려줌',
  })
  @Get('my-info/:targetId')
  async getMyInfoAndOwner(
    @GetUserId() userId: number,
    @Param('targetId', ParseIntPipe) targetId: number,
  ) {
    return this.userService.checkMyInfoOwner(userId, targetId);
  }
}
