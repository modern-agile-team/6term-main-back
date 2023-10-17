import { Injectable } from '@nestjs/common';
import { EntityManager, Equal } from 'typeorm';
import { BoardLike } from '../entities/board-like.entity';
import { User } from 'src/users/entities/user.entity';
import { Board } from '../entities/board.entity';

@Injectable()
export class BoardsLikeRepository {
  constructor(private entityManager: EntityManager) {}
  async addBoardLike(boardId: Board, userId: User) {
    const boardLike = new BoardLike();
    boardLike.boardId = boardId;
    boardLike.userId = userId;

    return this.entityManager.save(boardLike);
  }

  async getBoardLike(boardId: number) {
    const boardLike = await this.entityManager.find(BoardLike, {
      where: { boardId: Equal(boardId) },
    });

    return boardLike.length;
  }

  async deleteBoardLike(boardId: number, userId: number) {
    this.entityManager.delete(BoardLike, {
      boardId: boardId,
      userId: userId,
    });

    return { success: true, msg: '좋아요 삭제 성공', state: 'false' };
  }
}
