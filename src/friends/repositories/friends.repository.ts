import { Injectable } from '@nestjs/common';
import {
  DeleteResult,
  EntityManager,
  LessThan,
  MoreThanOrEqual,
} from 'typeorm';
import { Friend, Status } from '../entities/friends.entity';

@Injectable()
export class FriendsRepository {
  constructor(private readonly entityManager: EntityManager) {}

  async getFriendsReqPending(userId: number) {
    return this.entityManager
      .createQueryBuilder(Friend, 'friend')
      .where('friend.requesterId = :userId', { userId })
      .andWhere('friend.status = :status', { status: Status.PENDING })
      .leftJoin('friend.respondent', 'user')
      .leftJoin('user.userImage', 'userImage')
      .addSelect(['user.name', 'userImage.imageUrl'])
      .getMany();
  }

  async getFriendsResPending(userId: number): Promise<Friend[]> {
    return this.entityManager
      .createQueryBuilder(Friend, 'friend')
      .where('friend.respondentId = :userId', { userId })
      .andWhere('friend.status = :status', { status: Status.PENDING })
      .leftJoin('friend.requester', 'user')
      .leftJoin('user.userImage', 'userImage')
      .addSelect(['user.name', 'userImage.imageUrl'])
      .getMany();
  }

  async getFriends(userId: number): Promise<Friend[]> {
    return this.entityManager
      .createQueryBuilder(Friend, 'friend')
      .where('friend.requesterId = :userId', { userId })
      .andWhere('friend.status = :status', { status: Status.ACCEPT })
      .orWhere('friend.respondentId = :userId', { userId })
      .andWhere('friend.status = :status', { status: Status.ACCEPT })
      .leftJoin('friend.requester', 'user')
      .leftJoin('friend.respondent', 'user2')
      .leftJoin('user.userImage', 'userImage')
      .leftJoin('user2.userImage', 'userImage2')
      .addSelect(['user.name', 'userImage.imageUrl'])
      .addSelect(['user2.name', 'userImage2.imageUrl'])
      .getMany();
  }

  async getRejectPermanent(userId: number): Promise<Friend[]> {
    return this.entityManager
      .createQueryBuilder(Friend, 'friend')
      .where('friend.respondentId = :userId', { userId })
      .andWhere('friend.status = :status', { status: Status.PERMANENT })
      .leftJoin('friend.requester', 'user')
      .leftJoin('user.userImage', 'userImage')
      .addSelect(['user.name', 'userImage.imageUrl'])
      .getMany();
  }

  async friendRequest(userId: number, friendId: number): Promise<Friend> {
    const friend = new Friend();
    friend.requesterId = userId;
    friend.respondentId = friendId;
    friend.status = Status.PENDING;

    return await this.entityManager.save(friend);
  }

  async checkRejectTime(userId: number, friendId: number): Promise<Friend> {
    const friendRepository = this.entityManager.getRepository(Friend);

    return await friendRepository.findOne({
      where: {
        createdAt: MoreThanOrEqual(new Date(Date.now() - 24 * 60 * 60 * 1000)),
        requesterId: userId,
        respondentId: friendId,
        status: Status.REJECT,
      },
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async friendResponseAccept(
    userId: number,
    friendId: number,
  ): Promise<Friend> {
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

  async friendBlock(userId: number, friendId: number): Promise<Friend> {
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

    friend.status = Status.BLOCK;
    return await this.entityManager.save(friend);
  }

  async friendRequestCancel(
    userId: number,
    friendId: number,
  ): Promise<DeleteResult> {
    const friend = await this.entityManager.findOne(Friend, {
      where: {
        requesterId: userId,
        respondentId: friendId,
        status: Status.PENDING,
      },
    });

    if (!friend) {
      return null;
    }

    return await this.entityManager.delete(Friend, friend);
  }

  async friendResponseReject(
    userId: number,
    friendId: number,
  ): Promise<Friend> {
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
    return await this.entityManager.save(friend);
  }

  async friendResponseRejectPermanentCancel(
    userId: number,
    friendId: number,
  ): Promise<DeleteResult> {
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

  async friendResponseRejectPermanent(
    userId: number,
    friendId: number,
  ): Promise<Friend> {
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
    friend.status = Status.PERMANENT;
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

  async checkRejectPermanent(
    userId: number,
    friendId: number,
  ): Promise<Friend> {
    const check = await this.entityManager.findOne(Friend, {
      where: {
        requesterId: userId,
        respondentId: friendId,
        status: Status.PERMANENT,
      },
    });

    return check;
  }

  async checkBlock(userId: number, friendId: number): Promise<Friend> {
    const check = await this.entityManager.findOne(Friend, {
      where: [
        {
          requesterId: userId,
          respondentId: friendId,
          status: Status.BLOCK,
        },
        {
          requesterId: friendId,
          respondentId: userId,
          status: Status.BLOCK,
        },
      ],
    });

    return check;
  }

  async cleanupRejectedFriends() {
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    // 'REJECT' 상태이고 24시간 이상 지난 로우들을 찾아서 삭제
    const friendsToDelete = await this.entityManager.find(Friend, {
      where: {
        status: Status.REJECT,
        createdAt: LessThan(twentyFourHoursAgo),
      },
    });

    if (friendsToDelete.length === 0) {
      return null;
    }

    await this.entityManager.remove(friendsToDelete);

    return friendsToDelete.length;
  }
}
