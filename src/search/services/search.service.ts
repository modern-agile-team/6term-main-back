import { Injectable } from '@nestjs/common';
import { Board } from 'src/boards/entities/board.entity';
import { EntityManager } from 'typeorm';

@Injectable()
export class SearchService {
  constructor(private entityManager: EntityManager) {}
  async searchBoardsAsHeadOrBody(boardHead: string) {
    const boardRepository = this.entityManager.getRepository(Board);
    const returnedBoard = await boardRepository
      .createQueryBuilder()
      .select()
      .where(`MATCH(head) AGAINST (:boardHead)`, {
        boardHead: `${boardHead}`,
      })
      .orWhere(`MATCH(body) AGAINST (:boardHead);`, {
        boardHead: `${boardHead}`,
      })
      .getMany();
    return returnedBoard;
  }
}
