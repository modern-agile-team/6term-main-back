import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { BoardNotification } from '../entities/board-notice.entity';

@Injectable()
export class NoticeRepository {
  constructor(private entityManager: EntityManager) {}

  async getAllNotifications(userId: number) {
    return this.entityManager.find(BoardNotification, {
      where: { receiverId: userId },
    });
  }
}
