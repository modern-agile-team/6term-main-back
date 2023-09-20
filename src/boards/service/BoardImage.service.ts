import { Injectable } from '@nestjs/common';
import { BoardImage } from '../entities/board-image.entity'; // BoardImage 엔티티 임포트
import { S3Service } from '../../common/s3/s3.service'; // S3Service 임포트
// import { BoardImagesController } from '../controller/BoardImage.controller';

@Injectable()
export class BoardImagesService {
  constructor(private readonly s3Service: S3Service) {}

  async create(
    boardId: number,
    file: Express.Multer.File,
  ): Promise<BoardImage> {
    const userId = 1; // 사용자 ID (이건 나중에 준혁이가 변경할겁니다)

    // 이미지 업로드를 S3Service를 사용하여 실행
    const uploadedImage = await this.s3Service.imgUpload(file, userId);

    // 이미지 업로드에 성공하면 반환된 URL을 DB에 저장
    if (uploadedImage) {
      const boardImage = new BoardImage();
      boardImage.boardId = boardId;
      boardImage.imageUrl = uploadedImage.url; // S3에서 받아온 URL을 boardimage 테이블에 저장

      // boardImage를 데이터베이스에 저장
      const savedImage = await boardImage.save();

      return savedImage;
    } else {
      // 이미지 업로드 실패 시 적절하게 처리
      throw new Error('이미지 업로드 실패');
    }
  }
}
