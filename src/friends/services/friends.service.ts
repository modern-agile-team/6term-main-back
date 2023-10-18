import { Injectable } from "@nestjs/common";
import { FriendsRepository } from "../repositories/friends.repository";
import { User } from "src/users/entities/user.entity";

@Injectable()
export class FriendsService {
  constructor(
    private readonly friendsRepository: FriendsRepository,
  ) {}

  async friendRequest(userId: User, friendId: User) {
    return await this.friendsRepository.friendRequest(userId, friendId);
  }
}