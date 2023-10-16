import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { BoardsLikeRepository } from '../repository/boards-like.repository';
import { EntityManager, Equal } from 'typeorm';
import { Board } from '../entities/board.entity';
import { User } from 'src/users/entities/user.entity';
import { BoardLike } from '../entities/board-like.entity';

@Injectable()
export class BoardsLikeService {
  constructor(
    private entityManager: EntityManager,
    private boardsLikeRepositry: BoardsLikeRepository,
  ) {}

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

    return this.boardsLikeRepositry.addBoardLike(board, user);
  }

  async getBoardLike(boardId: number) {
    const board = await this.entityManager.findOne(Board, {
      where: { id: boardId },
    });

    if (!board) {
      throw new NotFoundException('해당 게시글이 없습니다.');
    }
    const boardLike = await this.boardsLikeRepositry.getBoardLike(boardId);

    if (!boardLike) {
      throw new NotFoundException('좋아요가 없습니다');
    }

    return boardLike;
  }

  async deleteBoardLike(boardId: number, userId: number) {
    const isBoardLike = await this.entityManager.find(BoardLike, {
      where: { boardId: Equal(boardId), userId: Equal(userId) },
    });

    if (!isBoardLike.length) {
      throw new NotFoundException('이미 좋아요가 없습니다.');
    }

    return this.boardsLikeRepositry.deleteBoardLike(boardId, userId);
  }
}
