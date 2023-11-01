import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { BoardImage } from '../entities/board-image.entity';
import { CreateBoardImageDto } from '../dto/create.board-image.dto';

@Injectable()
export class BoardImageRepository {
  constructor(private readonly entityManager: EntityManager) {}

  async saveBoardImage(boardImage: CreateBoardImageDto): Promise<BoardImage> {
    const newBoardImage = new BoardImage();
    newBoardImage.boardId = boardImage.boardId;
    newBoardImage.imageUrl = boardImage.imageUrl;
    const savedImage = await this.entityManager.save(BoardImage, newBoardImage);
    return savedImage; //test
  }
  async getBoardImages(boardId: number): Promise<BoardImage[]> {
    return this.entityManager.find(BoardImage, { where: { boardId } });
  }

  async createBoardImage(boardImage: CreateBoardImageDto): Promise<BoardImage> {
    const newImage = new BoardImage();
    newImage.boardId = boardImage.boardId;
    newImage.imageUrl = boardImage.imageUrl;
    return this.entityManager.save(newImage);
  }

  async deleteBoardImage(imageId: number): Promise<void> {
    await this.entityManager.delete(BoardImage, imageId);
  }
}
