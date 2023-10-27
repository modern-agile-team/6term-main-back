import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { EntityManager, LessThan } from 'typeorm';
import { BoardNotification, Separator } from '../entities/board-notice.entity';

@Injectable()
export class NoticeRepository {
  constructor(private entityManager: EntityManager) {}

  async getAllNotifications(userId: number) {
    return this.entityManager.find(BoardNotification, {
      withDeleted: true,
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

  async updateUnSeenNotification(notificationId: number) {
    const updateResult = await this.entityManager.update(
      BoardNotification,
      { id: notificationId },
      { isSeen: true, deletedAt: new Date() },
    );

    if (!updateResult.affected) {
      throw new HttpException(
        '데이터베이스 오류로 업데이트 실패.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return { success: true, msg: '업데이트 성공' };
  }

  async hardDeleteNotifications(oneWeekAgo: Date) {
    const deleteResult = await this.entityManager.delete(BoardNotification, {
      deletedAt: LessThan(oneWeekAgo),
    });
    return {
      success: true,
      msg: `${deleteResult.affected}개의 알람을 지웠습니다.`,
    };
  }
}
