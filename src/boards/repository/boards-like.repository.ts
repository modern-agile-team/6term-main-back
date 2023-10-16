import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { EntityManager, Equal } from 'typeorm';
import { BoardLike } from '../entities/board-like.entity';
import { User } from 'src/users/entities/user.entity';
import { Board } from '../entities/board.entity';

@Injectable()
export class BoardsLikeRepository {
  constructor(private entityManager: EntityManager) {}
  async addBoardLike(boardId: number, userId: number) {
    const board = await this.entityManager.findOne(Board, {
      where: { id: boardId },
    });

    if (!board) {
      throw new NotFoundException('해당 게시글이 없습니다.');
    }

    const user = await this.entityManager.findOne(User, {
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('해당 유저가 없습니다');
    }

    const isBoardLike = await this.entityManager.find(BoardLike, {
      where: { boardId: Equal(boardId), userId: Equal(userId) },
    });

    if (isBoardLike.length) {
      throw new ConflictException('이미 좋아요가 있습니다');
    }

    const boardLike = new BoardLike();
    boardLike.boardId = board;
    boardLike.userId = user;

    return await this.entityManager.save(boardLike);
  }

  async getBoardLike(boardId: number) {
    try {
      const board = await this.entityManager.findOne(Board, {
        where: { id: boardId },
      });

      if (!board) {
        throw new NotFoundException('해당 게시글이 없습니다.');
      }

      const boardLike = await this.entityManager.find(BoardLike, {
        where: { boardId: Equal(boardId) },
      });

      return boardLike.length;
    } catch (error) {
      console.error('좋아요 개수 조회 실패: ', error);
      throw error;
    }
  }

  async deleteBoardLike(boardId: number, userId: number) {
    try {
      const isBoardLike = await this.entityManager.find(BoardLike, {
        where: { boardId: Equal(boardId), userId: Equal(userId) },
      });

      if (!isBoardLike.length) {
        throw new NotFoundException('이미 좋아요가 없습니다.');
      }

      await this.entityManager.delete(BoardLike, {
        boardId: boardId,
        userId: userId,
      });

      return { success: true, msg: '좋아요 삭제 성공' };
    } catch (error) {
      console.error('좋아요 취소 실패: ', error);
      throw error;
    }
  }
}
