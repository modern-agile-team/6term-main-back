import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { BoardLike } from '../entities/board-like.entity';

@Injectable()
export class BoardsLikeRepository {
  constructor(private entityManager: EntityManager) {}
  async addBoardLike(boardId: number, userId: number) {
    const boardLike = new BoardLike();
    boardLike.boardId = boardId;
    boardLike.userId = userId;

    await this.entityManager.save(boardLike);

    return { success: true, msg: '좋아요 생성 성공', isLike: true };
  }

  async getBoardLikesCount(boardId: number): Promise<number> {
    const likesCount: number = await this.entityManager.count(BoardLike, {
      where: { boardId: boardId },
    });
    return likesCount;
  }

  async deleteBoardLike(boardId: number, userId: number) {
    this.entityManager.delete(BoardLike, {
      boardId: boardId,
      userId: userId,
    });

    return { success: true, msg: '좋아요 삭제 성공', isLike: false };
  }
}
