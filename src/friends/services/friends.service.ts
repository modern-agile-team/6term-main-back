import { Injectable } from "@nestjs/common";
import { FriendsRepository } from "../repositories/friends.repository";
import { User } from "src/users/entities/user.entity";

@Injectable()
export class FriendsService {
  constructor(
    private readonly friendsRepository: FriendsRepository,
  ) {}

  async getFriendsReqStatus(userId: User) {
    const getFriendsReqStatus = await this.friendsRepository.getFriendsReqStatus(userId);
    const respondent = [];
    for (let i = 0; i < getFriendsReqStatus.length; i++) {
      const respondentId = getFriendsReqStatus[i].respondentId.id;
      const respondentName = getFriendsReqStatus[i].respondentId.name;
      const status = getFriendsReqStatus[i].status;
      respondent.push(respondentId, respondentName, status);
    }
    return respondent;
  }

  async friendRequest(userId: User, friendId: User) {
    return await this.friendsRepository.friendRequest(userId, friendId);
  }
}