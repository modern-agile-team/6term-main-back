import { Body, Controller, Headers, Post } from "@nestjs/common";
import { FriendsService } from "../services/friends.service";
import { TokenService } from "src/auth/services/token.service";
import { User } from "src/users/entities/user.entity";

@Controller('friends')
export class FriendsController {
  constructor(
    private readonly friendsService: FriendsService,
    private readonly tokenService: TokenService,
  ) {}

  @Post()
  async friendRequest(@Headers('access_token') accessToken: string, @Headers('friend_id') friendId:User) {
    const userId = await this.tokenService.decodeToken(accessToken);
    console.log(userId, friendId);
    
    return await this.friendsService.friendRequest(userId, friendId);
  }
}