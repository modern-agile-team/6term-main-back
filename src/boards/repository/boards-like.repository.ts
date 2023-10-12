import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';

@Injectable()
export class BoardsLikeRepository {
  constructor(private entityManager: EntityManager) {
    async addBoardLike(boardId: number, userId: number) {

    }
  }
}
