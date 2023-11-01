import { Injectable, NotFoundException } from '@nestjs/common';
import { NoticeRepository } from '../repositories/notice.repository';
import { EntityManager } from 'typeorm';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class NoticeService {
  constructor(
    private noticeRepository: NoticeRepository,
    private entityManager: EntityManager,
  ) {}

  async getAllNotifications(userId: number) {
    const isUser = await this.entityManager.findOne(User, {
      where: { id: userId },
    });
    if (!isUser) {
      throw new NotFoundException('해당 유저를 찾지 못했습니다.');
    }
    return this.noticeRepository.getAllNotifications(userId);
  }

  async createBoardNoticeFromComment(
    boardId: number,
    senderId: number,
    receiverId: number,
  ) {
    return this.noticeRepository.createBoardNoticeFromComment(
      boardId,
      senderId,
      receiverId,
    );
  }

  async createCommentNoticeFromRecomment(
    boardId: number,
    senderId: number,
    receiverId: number,
  ) {
    return this.noticeRepository.createCommentNoticeFromRecomment(
      boardId,
      senderId,
      receiverId,
    );
  }

  async createBoardNoticeFromLike(
    boardId: number,
    senderId: number,
    receiverId: number,
  ) {
    return this.noticeRepository.createBoardNoticeFromLike(
      boardId,
      senderId,
      receiverId,
    );
  }

  async updateUnSeenNotification(notificationId: number) {
    return this.noticeRepository.updateUnSeenNotification(notificationId);
  }

  async hardDeleteNotifications() {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    return this.noticeRepository.hardDeleteNotifications(oneWeekAgo);
  }
}
