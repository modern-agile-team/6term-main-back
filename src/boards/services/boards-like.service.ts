import { Injectable, NotFoundException } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { BoardsLikeRepository } from '../repository/boards-like.repository';

@Injectable()
export class BoardsLikeService {
  constructor(
    private entityManager: EntityManager,
    private boardsLikeRepositry: BoardsLikeRepository,
  ) {}

  async addBoardLike(boardId: number, userId: number) {
    try {
      return await this.boardsLikeRepositry.addBoardLike(boardId, userId);
    } catch (error) {
      console.error('좋아요 추가 실패: ', error);
      throw error;
    }
  }

  async getBoardLike(boardId: number) {
    try {
      const boardLike = await this.boardsLikeRepositry.getBoardLike(boardId);

      if (!boardLike) {
        throw new NotFoundException('좋아요가 없습니다');
      }

      return boardLike;
    } catch (error) {
      console.error('좋아요 개수 조회 실패: ', error);
      throw error;
    }
  }

  async deleteBoardLike(boardId: number, userId: number) {
    try {
      return await this.boardsLikeRepositry.deleteBoardLike(boardId, userId);
    } catch (error) {
      console.error('좋아요 취소 실패: ', error);
      throw error;
    }
  }
}
