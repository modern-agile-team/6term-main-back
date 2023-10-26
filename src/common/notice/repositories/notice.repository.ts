import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { BoardNotification, Separator } from '../entities/board-notice.entity';

@Injectable()
export class NoticeRepository {
  constructor(private entityManager: EntityManager) {}

  async getAllNotifications(userId: number) {
    return this.entityManager.find(BoardNotification, {
      where: { receiverId: userId },
    });
  }

  async createBoardNoticeFromComment(
    boardId: number,
    senderId: number,
    receiverId: number,
  ) {
    const boardNotice = new BoardNotification();
    boardNotice.boardId = boardId;
    boardNotice.senderId = senderId;
    boardNotice.receiverId = receiverId;
    boardNotice.separator = Separator.COMMENT;
    return this.entityManager.save(BoardNotification, boardNotice);
  }

  async createCommentNoticeFromRecomment(
    boardId: number,
    senderId: number,
    receiverId: number,
  ) {
    const boardNotice = new BoardNotification();
    boardNotice.boardId = boardId;
    boardNotice.senderId = senderId;
    boardNotice.receiverId = receiverId;
    boardNotice.separator = Separator.RECOMMENT;
    return this.entityManager.save(BoardNotification, boardNotice);
  }

  async createBoardNoticeFromLike(
    boardId: number,
    senderId: number,
    receiverId: number,
  ) {
    const boardNotice = new BoardNotification();
    boardNotice.boardId = boardId;
    boardNotice.senderId = senderId;
    boardNotice.receiverId = receiverId;
    boardNotice.separator = Separator.LIKE;
    return this.entityManager.save(BoardNotification, boardNotice);
  }
}
