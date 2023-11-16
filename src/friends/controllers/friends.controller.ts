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
import { ApiDeleteRequest } from '../swagger-decorators/delete-request.decorator';
import { ApiFriendBlock } from '../swagger-decorators/friend-block.decorator';

@UseGuards(JwtAccessTokenGuard)
@Controller('friends')
@ApiTags('friends API')
export class FriendsController {
  constructor(private readonly friendsService: FriendsService) {}

  @ApiGetFriendsReqPending()
  @Get('requests/pending')
  async getFriendsReqPending(@GetUserId() userId: number) {
    return await this.friendsService.getFriendsReqPending(userId);
  }

  @ApiGetFriendsResPending()
  @Get('responses/pending')
  async getFriendsResPending(@GetUserId() userId: number) {
    return await this.friendsService.getFriendsResPending(userId);
  }

  @ApiGetFriends()
  @Get()
  async getFriends(@GetUserId() userId: number) {
    return await this.friendsService.getFriends(userId);
  }

  @ApiGetRejectPermanent()
  @Get('responses/reject/permanent')
  async getRejectPermanent(@GetUserId() userId: number) {
    return await this.friendsService.getRejectPermanent(userId);
  }

  @ApiFriendRequest()
  @Post('requests/:friend_id')
  async friendRequest(
    @GetUserId() userId: number,
    @Param('friend_id') friendId: number,
  ) {
    return await this.friendsService.friendRequest(userId, friendId);
  }

  @ApiFriendResponseAccept()
  @Patch('responses/accept/:friend_id')
  async friendResponseAccept(
    @GetUserId() userId: number,
    @Param('friend_id') friendId: number,
  ) {
    return await this.friendsService.friendResponseAccept(userId, friendId);
  }

  @ApiFriendResponseReject()
  @Patch('responses/reject/:friend_id')
  async friendResponseReject(
    @GetUserId() userId: number,
    @Param('friend_id') friendId: number,
  ) {
    return await this.friendsService.friendResponseReject(userId, friendId);
  }

  @ApiFriendBlock()
  @Patch('block/:friend_id')
  async friendBlock(
    @GetUserId() userId: number,
    @Param('friend_id') friendId: number,
  ) {
    return await this.friendsService.friendBlock(userId, friendId);
  }

  @ApiFriendResponseRejectPermanent()
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

  @ApiDeleteRequest()
  @Delete('requests/cancel/:friend_id')
  async friendRequestCancel(
    @GetUserId() userId: number,
    @Param('friend_id') friendId: number,
  ) {
    return await this.friendsService.friendRequestCancel(userId, friendId);
  }

  @ApiDeleteRejectPermanentCancel()
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

  @ApiDeleteFriend()
  @Delete(':friend_id')
  async deleteFriend(
    @GetUserId() userId: number,
    @Param('friend_id') friendId: number,
  ) {
    return await this.friendsService.deleteFriend(userId, friendId);
  }
}
