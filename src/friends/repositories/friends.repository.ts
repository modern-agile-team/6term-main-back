import { Injectable } from '@nestjs/common';
import { DeleteResult, EntityManager } from 'typeorm';
import { Friend, Status } from '../entities/friends.entity';

@Injectable()
export class FriendsRepository {
  constructor(private readonly entityManager: EntityManager) {}

  async getFriendsReqPending(userId: number): Promise<Friend[]> {
    return await this.entityManager.find(Friend, {
      where: {
        requesterId: userId,
        status: Status.PENDING,
      },
    });
  }

  async getFriendsResPending(userId: number): Promise<Friend[]> {
    return await this.entityManager.find(Friend, {
      where: {
        respondentId: userId,
        status: Status.PENDING,
      },
    });
  }

  async getFriends(userId: number): Promise<Friend[]> {
    return await this.entityManager.find(Friend, {
      where: [
        {
          requesterId: userId,
          status: Status.ACCEPT,
        },
        {
          respondentId: userId,
          status: Status.ACCEPT,
        },
      ],
    });
  }

  async getRejectPermanent(userId: number): Promise<Friend[]> {
    return await this.entityManager.find(Friend, {
      where: {
        respondentId: userId,
        status: Status.PERMANENT,
      },
    });
  }

  async friendRequest(userId: number, friendId: number): Promise<Friend> {
    const friend = new Friend();
    friend.requesterId = userId;
    friend.respondentId = friendId;
    friend.status = Status.PENDING;

    return await this.entityManager.save(friend);
  }

  async friendResponseAccept(userId: number, friendId: number): Promise<Friend> {
    const friend = await this.entityManager.findOne(Friend, {
      where: {
        requesterId: friendId,
        respondentId: userId,
        status: Status.PENDING,
      },
    });

    if (!friend) {
      return null;
    }
    
    friend.status = Status.ACCEPT;
    return await this.entityManager.save(friend);
  }

  async friendResponseReject(userId: number, friendId: number): Promise<DeleteResult> {
    const friend = await this.entityManager.findOne(Friend, {
      where: {
        requesterId: friendId,
        respondentId: userId,
        status: Status.PENDING,
      },
    });

    if (!friend) {
      return null;
    }
    
    return await this.entityManager.delete(Friend, friend);
  }

  async friendResponseRejectPermanentCancel(userId: number, friendId: number): Promise<DeleteResult> {
    const friend = await this.entityManager.findOne(Friend, {
      where: {
        requesterId: friendId,
        respondentId: userId,
        status: Status.PERMANENT,
      },
    });

    if (!friend) {
      return null;
    }
    
    return await this.entityManager.delete(Friend, friend);
  }

  async friendResponseRejectPermanent(userId: number, friendId: number): Promise<Friend> {
    const friend = await this.entityManager.findOne(Friend, {
      where: {
        requesterId: friendId,
        respondentId: userId,
        status: Status.PENDING,
      },
    });

    if (!friend) {
      return null;
    }
    friend.status = Status.REJECT;
    return await this.entityManager.save(Friend, friend);
  }

  async deleteFriend(userId: number, friendId: number): Promise<DeleteResult> {
    const friend = await this.entityManager.findOne(Friend, {
      where: [
        {
          requesterId: userId,
          respondentId: friendId,
          status: Status.ACCEPT,
        },
        {
          requesterId: friendId,
          respondentId: userId,
          status: Status.ACCEPT,
        },
      ],
    });

    if (!friend) {
      return null;
    }
    
    return await this.entityManager.delete(Friend, friend);
  }

  async checkRejectPermanent(userId: number, friendId: number): Promise<Friend> {
    const check = await this.entityManager.findOne(Friend, {
      where: {
        requesterId: userId,
        respondentId: friendId,
        status: Status.PERMANENT,
      },
    });
    
    return check;
  }
}
