import { Injectable } from "@nestjs/common";
import { EntityManager } from "typeorm";
import { Friend, Status } from "../entities/friends.entity";

@Injectable()
export class FriendsRepository {
  constructor(
    private readonly entityManager: EntityManager,
  ) {}

  async getFriendsReqStatus(userId: number): Promise<Friend[]> {
    const friends = await this.entityManager.find(Friend, {
      where: [
        { requesterId: userId },
      ],
    });

    return friends;
  }

  async friendRequest(userId: number, friendId: number): Promise<Friend> {
    const friend = new Friend();
    friend.requesterId = userId;
    friend.respondentId = friendId;
    friend.status = Status.PENDING;

    return await this.entityManager.save(friend);
  }
}