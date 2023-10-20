import { Controller, Get, Headers, Param, Post } from '@nestjs/common';
import { FriendsService } from '../services/friends.service';
import { TokenService } from 'src/auth/services/token.service';
import { ApiGetFriendsReqPending } from '../swagger-decorators/get-friends-req-pending.decorator';
import { ApiTags } from '@nestjs/swagger';
import { ApiFriendRequest } from '../swagger-decorators/friend-request.docorator';
import { ApiGetFriends } from '../swagger-decorators/get-friends.docorator';

@Controller('friends')
@ApiTags('friends API')
export class FriendsController {
  constructor(
    private readonly friendsService: FriendsService,
    private readonly tokenService: TokenService,
  ) {}
  
  @ApiGetFriendsReqPending()
  @Get('requests/pending')
  async getFriendsReqPending(@Headers('access_token') accessToken: string) {
    const userId = await this.tokenService.decodeToken(accessToken);
    return await this.friendsService.getFriendsReqPending(userId);
  }

  @ApiGetFriends()
  @Get()
  async getFriends(@Headers('access_token') accessToken: string) {
    const userId = await this.tokenService.decodeToken(accessToken);
    return await this.friendsService.getFriends(userId);
  }

  @ApiFriendRequest()
  @Post('requests/:friend_id')
  async friendRequest(@Headers('access_token') accessToken: string, @Param('friend_id') friendId: number) {
    const userId = await this.tokenService.decodeToken(accessToken);
    return await this.friendsService.friendRequest(userId, friendId);
  }
}