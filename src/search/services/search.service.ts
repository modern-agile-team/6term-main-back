import { Injectable } from '@nestjs/common';
import { Board } from 'src/boards/entities/board.entity';
import { EntityManager } from 'typeorm';

@Injectable()
export class SearchService {
  constructor(private entityManager: EntityManager) {}
  async searchBoardsAsHead(boardHead: string) {
    const boardRepository = this.entityManager.getRepository(Board);
    const returnedBoard = await boardRepository
      .createQueryBuilder()
      .select()
      .where(`MATCH(head) AGAINST (:boardHead IN BOOLEAN MODE);`, {
        boardHead: boardHead,
      })
      .getMany();
    return returnedBoard;
  }
}
