import { Injectable } from '@nestjs/common';
import { Board } from 'src/boards/entities/board.entity';
import { User } from 'src/users/entities/user.entity';
import { EntityManager } from 'typeorm';

@Injectable()
export class SearchRepository {
  constructor(private entityManager: EntityManager) {}
  async searchBoardsByHead(searchQuery: string) {
    const boardRepository = this.entityManager.getRepository(Board);

    return boardRepository
      .createQueryBuilder('board')
      .select()
      .leftJoinAndSelect('board.user', 'user')
      .leftJoinAndSelect('user.userImage', 'userImage')
      .leftJoinAndSelect('board.boardImages', 'boardImages')
      .where(`MATCH(head) AGAINST (:searchQuery)`, {
        searchQuery,
      })
      .getMany();
  }

  async searchBoardsByBody(searchQuery: string) {
    const boardRepository = this.entityManager.getRepository(Board);

    return boardRepository
      .createQueryBuilder('board')
      .select()
      .leftJoinAndSelect('board.user', 'user')
      .leftJoinAndSelect('user.userImage', 'userImage')
      .leftJoinAndSelect('board.boardImages', 'boardImages')
      .where(`MATCH(body) AGAINST (:searchQuery)`, {
        searchQuery,
      })
      .getMany();
  }

  async searchUsersByName(searchQuery: string) {
    const userRepository = this.entityManager.getRepository(User);

    return userRepository
      .createQueryBuilder()
      .select()
      .where(`MATCH(name) AGAINST (:searchQuery)`, {
        searchQuery,
      })
      .getMany();
  }
}
