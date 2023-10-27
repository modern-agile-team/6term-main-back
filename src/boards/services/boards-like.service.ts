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
import { NoticeService } from 'src/common/notice/services/notice.service';

@Injectable()
export class BoardsLikeService {
  constructor(
    private noticeService: NoticeService,
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

    const returnedLike = await this.boardsLikeRepositry.addBoardLike(
      boardId,
      userId,
    );

    const returnedBoard = await this.entityManager.findOne(Board, {
      where: { id: boardId },
    });

    await this.noticeService.createBoardNoticeFromLike(
      boardId,
      userId,
      returnedBoard.userId,
    );

    return returnedLike;
  }

  async getBoardLikes(boardId: number) {
    const board = await this.entityManager.findOne(Board, {
      where: { id: boardId },
    });
    if (!board) {
      throw new Error('해당 게시글이 없습니다. ');
    }
    return this.boardsLikeRepositry.getBoardLikesCount(boardId);
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
