import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { BoardLike } from './entities/board-like.entity';
import { User } from 'src/users/entities/user.entity';
import { Board } from './entities/board.entity';

@Injectable()
export class BoardsLikeService {
  constructor(private entityManager: EntityManager) {}

  async addBoardLike(boardId: number, userId: number) {
    const board = await this.entityManager.findOne(Board, {
      where: { id: boardId },
    });

    const user = await this.entityManager.findOne(User, {
      where: { id: userId },
    });

    const boardLike = new BoardLike();
    boardLike.boardId = board;
    boardLike.userId = user;

    return await this.entityManager.save(boardLike);
  }

  async getBoardLike(boardId: number) {
    const board = await this.entityManager.findOne(Board, {
      where: { id: boardId },
    });
    const boardLike = await this.entityManager.find(BoardLike, {
      where: { boardId: board },
    });
    return boardLike.length;
  }
}
