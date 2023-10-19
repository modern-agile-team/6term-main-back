import { Injectable } from '@nestjs/common';
import { FriendsRepository } from '../repositories/friends.repository';

@Injectable()
export class FriendsService {
  constructor(private readonly friendsRepository: FriendsRepository) {}

  async friendRequest(userId: number, friendId: number) {
    return await this.friendsRepository.friendRequest(userId, friendId);
  }
}
