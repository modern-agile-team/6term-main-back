import { Injectable } from '@nestjs/common';
import { Board } from 'src/boards/entities/board.entity';
import { User } from 'src/users/entities/user.entity';
import { EntityManager } from 'typeorm';

@Injectable()
export class SearchService {
  constructor(private entityManager: EntityManager) {}
  async searchBoardsAsHeadOrBody(searchQuery: string) {
    const boardRepository = this.entityManager.getRepository(Board);

    return boardRepository
      .createQueryBuilder()
      .select()
      .where(`MATCH(head) AGAINST (:searchQuery)`, {
        searchQuery: `${searchQuery}`,
      })
      .orWhere(`MATCH(body) AGAINST (:searchQuery);`, {
        searchQuery: `${searchQuery}`,
      })
      .getMany();
  }

  async searchUsersAsName(searchQuery: string) {
    const userRepository = this.entityManager.getRepository(User);

    return userRepository
      .createQueryBuilder()
      .select()
      .where(`MATCH(name) AGAINST (:searchQuery);`, {
        searchQuery: `${searchQuery}`,
      })
      .getMany();
  }
}
