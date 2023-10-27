import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { FriendsRepository } from '../repositories/friends.repository';
import { Status } from '../entities/friends.entity';

@Injectable()
export class FriendsService {
  constructor(private readonly friendsRepository: FriendsRepository) {}

  async getFriendsReqPending(userId: number) {
    return await this.friendsRepository.getFriendsReqPending(userId);
  }

  async getFriendsResPending(userId: number) {
    return await this.friendsRepository.getFriendsResPending(userId);
  }

  async getFriends(userId: number) {
    return await this.friendsRepository.getFriends(userId);
  }

  async getRejectPermanent(userId: number) {
    return await this.friendsRepository.getRejectPermanent(userId);
  }

  async friendRequest(userId: number, friendId: number) {
    try {
      const checkRejectPermanent = await this.checkRejectPermanent(userId, friendId);
      if (checkRejectPermanent) {
        throw new HttpException('상대방이 친구 요청을 영구적으로 거절했습니다.', HttpStatus.GONE);
      }

      const checkRejectTime = await this.friendsRepository.checkRejectTime(userId, friendId);
      if (checkRejectTime) {
        throw new HttpException('친구 요청은 24시간 이내에 한번만 가능합니다.', HttpStatus.GONE);
      }

      const getFriendsReqStatus = await this.getFriendsReqPending(userId);
      
      const isFriend = getFriendsReqStatus.find((friend) => {
        return ((userId === friend.requesterId && friendId == friend.respondentId) || (userId === friend.respondentId && friendId == friend.requesterId)) && friend.status === Status.ACCEPT;
      });
      
      if (isFriend) {
        throw new HttpException('이미 친구입니다.', HttpStatus.CONFLICT);
      }

      const isRequested = getFriendsReqStatus.find((friend) => {
        return userId === friend.requesterId && friendId == friend.respondentId && friend.status === Status.PENDING;
      });

      if (isRequested) {
        throw new HttpException('이미 친구 요청을 보냈습니다.', HttpStatus.CONFLICT);
      }

      await this.friendsRepository.friendRequest(userId, friendId);
      return { message: '친구 요청을 보냈습니다.' };

    } catch (error) {
      if (error.getStatus() === HttpStatus.GONE) {
        throw error;
      } else if (error.getStatus() === HttpStatus.CONFLICT) {
        throw error;
      } else if (error.code === 'ER_NO_REFERENCED_ROW_2') {
        throw new HttpException('유저를 찾을 수 없습니다.', HttpStatus.NOT_FOUND);
      } else {
        console.log(error);
        throw new HttpException('친구 요청에 실패했습니다.', HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  }

  async friendResponseAccept(userId: number, friendId: number) {
    try {
      const accept = await this.friendsRepository.friendResponseAccept(userId, friendId);
      if (!accept) {
        throw new HttpException('친구 요청을 찾을 수 없습니다.', HttpStatus.NOT_FOUND);
      }
      return { message: '친구 요청을 수락했습니다.' };
    } catch (error) {
      if (error.getStatus() === HttpStatus.NOT_FOUND) {
        throw error;
      } else {
        console.log(error);
        throw new HttpException('친구 요청 수락에 실패했습니다.', HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  }

  async friendResponseReject(userId: number, friendId: number) {
    try {
      const reject = await this.friendsRepository.friendResponseReject(userId, friendId);
      if (!reject) {
        throw new HttpException('친구 요청을 찾을 수 없습니다.', HttpStatus.NOT_FOUND);
      }
      return { message: '친구 요청을 거절했습니다.' };
    } catch (error) {
      if (error.getStatus() === HttpStatus.NOT_FOUND) {
        throw error;
      } else {
        console.log(error);
        throw new HttpException('친구 요청 거절에 실패했습니다.', HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  }
  async friendResponseRejectPermanentCancel(userId: number, friendId: number) {
    try {
      const rejectPermanentCancel = await this.friendsRepository.friendResponseRejectPermanentCancel(userId, friendId);
      if (!rejectPermanentCancel) {
        throw new HttpException('영구 거절한 친구 요청을 찾을 수 없습니다.', HttpStatus.NOT_FOUND);
      }
      return { message: '친구 요청 영구 거절을 취소했습니다.' };
    } catch (error) {
      if (error.getStatus() === HttpStatus.NOT_FOUND) {
        throw error;
      } else {
        console.log(error);
        throw new HttpException('친구 요청 영구 거절 취소에 실패했습니다.', HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  }

  async friendResponseRejectPermanent(userId: number, friendId: number) {
    try {
      const rejectPermanent = await this.friendsRepository.friendResponseRejectPermanent(userId, friendId);
      if (!rejectPermanent) {
        throw new HttpException('친구 요청을 찾을 수 없습니다.', HttpStatus.NOT_FOUND);
      }
      return { message: '친구 요청을 영구적으로 거절했습니다.' };
    } catch (error) {
      if (error.getStatus() === HttpStatus.NOT_FOUND) {
        throw error;
      } else {
        console.log(error);
        throw new HttpException('친구 요청 영구 거절에 실패했습니다.', HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  }

  async deleteFriend(userId: number, friendId: number) {
    try {
      const deleteFriend = await this.friendsRepository.deleteFriend(userId, friendId);
      if (!deleteFriend) {
        throw new HttpException('친구를 찾을 수 없습니다.', HttpStatus.NOT_FOUND);
      }
      return { message: '친구를 삭제했습니다.' };
    } catch (error) {
      if (error.getStatus() === HttpStatus.NOT_FOUND) {
        throw error;
      } else {
        console.log(error);
        throw new HttpException('친구 삭제에 실패했습니다.', HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  }

  async checkRejectPermanent(userId: number, friendId: number) {
    try {
      const checkRejectPermanent = await this.friendsRepository.checkRejectPermanent(userId, friendId);
      if (!checkRejectPermanent) {
        return false;
      }
      return true;
    } catch (error) {
      console.log(error);
      throw new HttpException('영구 거절 체크에 실패했습니다.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
