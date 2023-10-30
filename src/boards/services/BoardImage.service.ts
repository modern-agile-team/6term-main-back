import { Injectable } from '@nestjs/common';
import { BoardImageRepository } from '../repository/boardImage.repository';
import { S3Service } from '../../common/s3/s3.service';
import { CreateBoardImageDto } from '../dto/create.board-image.dto';

@Injectable()
export class BoardImagesService {
  constructor(
    private readonly s3Service: S3Service,
    private readonly boardImageRepository: BoardImageRepository,
  ) {}

  async createBoardImages(
    boardId: number,
    files: Express.Multer.File[],
    userId: number,
  ): Promise<CreateBoardImageDto[]> {
    const savedImagesArray: CreateBoardImageDto[] = [];
    for (const file of files) {
      const uploadedImage = await this.s3Service.BoardImageUpload(file, userId);
      const boardImage = new CreateBoardImageDto();
      boardImage.boardId = boardId;
      boardImage.imageUrl = uploadedImage.url;
      const savedImage =
        await this.boardImageRepository.saveBoardImage(boardImage);
      savedImagesArray.push(savedImage);
    }
    return savedImagesArray;
  }

  async updateBoardImages(
    boardId: number,
    formData: FormData,
    userId: number,
  ): Promise<CreateBoardImageDto[]> {
    const currentImages =
      await this.boardImageRepository.getBoardImages(boardId);
    const updatedImages: CreateBoardImageDto[] = [];

    for (const [key, value] of formData.entries()) {
      if (key === 'files') {
        if (typeof value === 'string' && value.startsWith('http')) {
          // value값이 URL인 경우, DB와 일치하는지 확인
          const existingImage = currentImages.find(
            (image) => image.imageUrl === value,
          );
          if (existingImage) {
            updatedImages.push(existingImage);
          }
        } else {
          const file = value as File; // 이미지 파일인 경우
          const fileUrl = await this.s3Service.BoardImageUpload(file, userId);

          const newImage = new CreateBoardImageDto();
          newImage.boardId = boardId;
          newImage.imageUrl = fileUrl.url;

          const savedImage =
            await this.boardImageRepository.createBoardImage(newImage);
          updatedImages.push(savedImage);
        }
      }
    }

    return updatedImages;
  }
}
