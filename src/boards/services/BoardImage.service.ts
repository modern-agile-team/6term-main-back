import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BoardImage } from '../entities/board-image.entity';
import { S3Service } from '../../common/s3/s3.service';

@Injectable()
export class BoardImagesService {
  constructor(
    private readonly s3Service: S3Service,
    @InjectRepository(BoardImage)
    private readonly boardImageRepository: Repository<BoardImage>,
  ) {}

  async create(
    boardId: number,
    file: Express.Multer.File,
  ): Promise<BoardImage> {
    const userId = 1; // 사용자 ID (이건 나중에 준혁이가 변경할겁니다)

    const uploadedImage = await this.s3Service.imgUpload(file, userId); // s3에 업로드하는거 -> (s3Service 에서 실행)
    if (uploadedImage) {
      const boardImage = new BoardImage();
      boardImage.boardId = boardId;
      boardImage.imageUrl = uploadedImage.url;
      const savedImage = await this.boardImageRepository.save(boardImage);

      return savedImage;
    } else {
      throw new Error('이미지 업로드 실패');
    }
  }
}
