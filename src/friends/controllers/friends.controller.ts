import { Controller, Get, Headers, Param, Post } from "@nestjs/common";
import { FriendsService } from "../services/friends.service";
import { TokenService } from "src/auth/services/token.service";

@Controller('friends')
export class FriendsController {
  constructor(
    private readonly friendsService: FriendsService,
    private readonly tokenService: TokenService,
  ) {}

  @Get()
  async getFriendsReqStatus(@Headers('access_token') accessToken: string) {
    const userId = await this.tokenService.decodeToken(accessToken);
    return await this.friendsService.getFriendsReqStatus(userId);
  }

  @Post('requests/:friend_id')
  async friendRequest(@Headers('access_token') accessToken: string, @Param('friend_id') friendId: number) {
    const userId = await this.tokenService.decodeToken(accessToken);
    return await this.friendsService.friendRequest(userId, friendId);
  }
}
