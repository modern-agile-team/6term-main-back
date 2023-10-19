import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { FriendsRepository } from "../repositories/friends.repository";
import { Status } from "../entities/friends.entity";

@Injectable()
export class FriendsService {
  constructor(
    private readonly friendsRepository: FriendsRepository,
  ) {}

  async getFriendsReqStatus(userId: number) {
    return await this.friendsRepository.getFriendsReqStatus(userId);
  }

  async friendRequest(userId: number, friendId: number) {
    try {
      const getFriendsReqStatus = await this.getFriendsReqStatus(userId);
      
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
      if (error.getStatus() === HttpStatus.CONFLICT) {
        throw error;
      } else if (error.code === 'ER_NO_REFERENCED_ROW_2') {
        throw new HttpException('유저를 찾을 수 없습니다.', HttpStatus.NOT_FOUND);
      } else {
        console.log(error);
        throw new HttpException('친구 요청에 실패했습니다.', HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  }
}