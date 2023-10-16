import { Injectable } from '@nestjs/common';
import { BoardImageRepository } from '../repository/boardImage.repository';
import { BoardImage } from '../entities/board-image.entity';
import { S3Service } from '../../common/s3/s3.service';

@Injectable()
export class BoardImagesService {
  constructor(
    private readonly s3Service: S3Service,
    private boardImageRepository: BoardImageRepository,
  ) {}

  async createBoardImages(
    boardId: number,
    file: Express.Multer.File,
  ): Promise<BoardImage> {
    const userId = 1; // 임시 사용자 id입니다
    const uploadedImage = await this.s3Service.imgUpload(file, userId);

    if (uploadedImage) {
      const boardImage = new BoardImage();
      boardImage.boardId = boardId;
      boardImage.imageUrl = uploadedImage.url;
      const savedImage =
        await this.boardImageRepository.saveBoardImage(boardImage);

      return savedImage;
    } else {
      throw new Error('이미지 업로드 실패');
    }
  }
}
