import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { BoardImage } from '../entities/board-image.entity';

@Injectable()
export class BoardImageRepository {
  constructor(private readonly entityManager: EntityManager) {}
  async saveBoardImage(boardImage: BoardImage): Promise<BoardImage> {
    return await this.entityManager.save(boardImage);
  }
}
