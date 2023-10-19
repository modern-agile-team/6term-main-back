import { Injectable } from "@nestjs/common";
import { EntityManager } from "typeorm";
import { Friend, Status } from "../entities/friends.entity";
import { User } from "src/users/entities/user.entity";

@Injectable()
export class FriendsRepository {
  constructor(
    private readonly entityManager: EntityManager,
  ) {}

  async getFriendsReqStatus(userId: User): Promise<Friend[]> {
    return await this.entityManager.find(Friend, {
      where: { requesterId: userId },
      select: ['id', 'status'],
      relations: ['requesterId', 'respondentId'],
    });
  }
  
  

  async friendRequest(userId: User, friendId: User): Promise<Friend> {
    const friend = new Friend();
    friend.requesterId = userId;
    friend.respondentId = friendId;
    friend.status = Status.PENDING;

    return await this.entityManager.save(friend);
  }
}