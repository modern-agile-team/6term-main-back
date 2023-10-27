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
    return savedImage;
  }
  // async updateBoardImage(boardImage: CreateBoardImageDto): Promise<BoardImage> {
  //   const newBoardImages = new BoardImage();
  //   newBoardImages.boardId = boardImage.boardId;
  //   newBoardImages.imageUrl = boardImage.imageUrl;
  //   const savedImages = await this.entityManager.update(
  //     BoardImage,
  //     newBoardImages,
  //   );
  //   return savedImages;
  // }
}
