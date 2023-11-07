import {
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { FriendsService } from '../services/friends.service';
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
import { JwtAccessTokenGuard } from 'src/config/guards/jwt-access-token.guard';
import { GetUserId } from 'src/common/decorators/get-userId.decorator';

@Controller('friends')
@ApiTags('friends API')
export class FriendsController {
  constructor(private readonly friendsService: FriendsService) {}

  @ApiGetFriendsReqPending()
  @UseGuards(JwtAccessTokenGuard)
  @Get('requests/pending')
  async getFriendsReqPending(@GetUserId() userId: number) {
    return await this.friendsService.getFriendsReqPending(userId);
  }

  @ApiGetFriendsResPending()
  @UseGuards(JwtAccessTokenGuard)
  @Get('responses/pending')
  async getFriendsResPending(@GetUserId() userId: number) {
    return await this.friendsService.getFriendsResPending(userId);
  }

  @ApiGetFriends()
  @UseGuards(JwtAccessTokenGuard)
  @Get()
  async getFriends(@GetUserId() userId: number) {
    return await this.friendsService.getFriends(userId);
  }

  @ApiGetRejectPermanent()
  @UseGuards(JwtAccessTokenGuard)
  @Get('responses/reject/permanent')
  async getRejectPermanent(@GetUserId() userId: number) {
    return await this.friendsService.getRejectPermanent(userId);
  }

  @ApiFriendRequest()
  @UseGuards(JwtAccessTokenGuard)
  @Post('requests/:friend_id')
  async friendRequest(
    @GetUserId() userId: number,
    @Param('friend_id') friendId: number,
  ) {
    return await this.friendsService.friendRequest(userId, friendId);
  }

  @ApiFriendResponseAccept()
  @UseGuards(JwtAccessTokenGuard)
  @Patch('responses/accept/:friend_id')
  async friendResponseAccept(
    @GetUserId() userId: number,
    @Param('friend_id') friendId: number,
  ) {
    return await this.friendsService.friendResponseAccept(userId, friendId);
  }

  @ApiFriendResponseReject()
  @UseGuards(JwtAccessTokenGuard)
  @Patch('responses/reject/:friend_id')
  async friendResponseReject(
    @GetUserId() userId: number,
    @Param('friend_id') friendId: number,
  ) {
    return await this.friendsService.friendResponseReject(userId, friendId);
  }

  @ApiDeleteRejectPermanentCancel()
  @UseGuards(JwtAccessTokenGuard)
  @Delete('responses/reject/permanent/:friend_id')
  async friendResponseRejectPermanentCancel(
    @GetUserId() userId: number,
    @Param('friend_id') friendId: number,
  ) {
    return await this.friendsService.friendResponseRejectPermanentCancel(
      userId,
      friendId,
    );
  }

  @ApiFriendResponseRejectPermanent()
  @UseGuards(JwtAccessTokenGuard)
  @Patch('responses/reject/permanent/:friend_id')
  async friendResponseRejectPermanent(
    @GetUserId() userId: number,
    @Param('friend_id') friendId: number,
  ) {
    return await this.friendsService.friendResponseRejectPermanent(
      userId,
      friendId,
    );
  }

  @ApiDeleteFriend()
  @UseGuards(JwtAccessTokenGuard)
  @Delete(':friend_id')
  async deleteFriend(
    @GetUserId() userId: number,
    @Param('friend_id') friendId: number,
  ) {
    return await this.friendsService.deleteFriend(userId, friendId);
  }
}
