import { Controller, Delete, Get, Headers, Param, Patch, Post } from '@nestjs/common';
import { FriendsService } from '../services/friends.service';
import { TokenService } from 'src/auth/services/token.service';
import { ApiGetFriendsReqPending } from '../swagger-decorators/get-friends-req-pending.decorator';
import { ApiTags } from '@nestjs/swagger';
import { ApiFriendRequest } from '../swagger-decorators/friend-request.decorator';
import { ApiGetFriends } from '../swagger-decorators/get-friends.decorator';
import { ApiGetFriendsResPending } from '../swagger-decorators/get-friends-res-pending.decorator';
import { ApiFriendResponseAccept } from '../swagger-decorators/friend-response-accept.decorator';
import { ApiFriendResponseReject } from '../swagger-decorators/friend-response-reject.decorator';
import { ApiDeleteFriend } from '../swagger-decorators/delete-friend.decorator';
import { ApiFriendResponseRejectPermanent } from '../swagger-decorators/friend-response-reject-permanent.decorator';
import { ApiGetRejectPermanent } from '../swagger-decorators/get-reject-permanent.decorator';
import { ApiDeleteRejectPermanentCancel } from '../swagger-decorators/delete-reject-permanent-cancel.decorator';

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

  @ApiGetFriendsResPending()
  @Get('responses/pending')
  async getFriendsResPending(@Headers('access_token') accessToken: string) {
    const userId = await this.tokenService.decodeToken(accessToken);
    return await this.friendsService.getFriendsResPending(userId);
  }

  @ApiGetFriends()
  @Get()
  async getFriends(@Headers('access_token') accessToken: string) {
    const userId = await this.tokenService.decodeToken(accessToken);
    return await this.friendsService.getFriends(userId);
  }

  @ApiGetRejectPermanent()
  @Get('responses/reject/permanent')
  async getRejectPermanent(@Headers('access_token') accessToken: string) {
    const userId = await this.tokenService.decodeToken(accessToken);
    return await this.friendsService.getRejectPermanent(userId);
  }

  @ApiFriendRequest()
  @Post('requests/:friend_id')
  async friendRequest(@Headers('access_token') accessToken: string, @Param('friend_id') friendId: number) {
    const userId = await this.tokenService.decodeToken(accessToken);
    return await this.friendsService.friendRequest(userId, friendId);
  }

  @ApiFriendResponseAccept()
  @Patch('responses/accept/:friend_id')
  async friendResponseAccept(@Headers('access_token') accessToken: string, @Param('friend_id') friendId: number) {
    const userId = await this.tokenService.decodeToken(accessToken);
    return await this.friendsService.friendResponseAccept(userId, friendId);
  }

  @ApiFriendResponseReject()
  @Delete('responses/reject/:friend_id')
  async friendResponseReject(@Headers('access_token') accessToken: string, @Param('friend_id') friendId: number) {
    const userId = await this.tokenService.decodeToken(accessToken);
    return await this.friendsService.friendResponseReject(userId, friendId);
  }

  @ApiDeleteRejectPermanentCancel()
  @Delete('responses/reject/permanent/:friend_id')
  async friendResponseRejectPermanentCancel(@Headers('access_token') accessToken: string, @Param('friend_id') friendId: number) {
    const userId = await this.tokenService.decodeToken(accessToken);
    return await this.friendsService.friendResponseRejectPermanentCancel(userId, friendId);
  }

  @ApiFriendResponseRejectPermanent()
  @Patch('responses/reject/permanent/:friend_id')
  async friendResponseRejectPermanent(@Headers('access_token') accessToken: string, @Param('friend_id') friendId: number) {
    const userId = await this.tokenService.decodeToken(accessToken);
    return await this.friendsService.friendResponseRejectPermanent(userId, friendId);
  }

  @ApiDeleteFriend()
  @Delete(':friend_id')
  async deleteFriend(@Headers('access_token') accessToken: string, @Param('friend_id') friendId: number) {
    const userId = await this.tokenService.decodeToken(accessToken);
    return await this.friendsService.deleteFriend(userId, friendId);
  }
}