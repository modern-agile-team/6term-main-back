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
    files: Express.Multer.File[],
    userId: number,
  ): Promise<CreateBoardImageDto[]> {
    const currentImages =
      await this.boardImageRepository.getBoardImages(boardId);

    const updatedImages: CreateBoardImageDto[] = [];

    for (const file of files) {
      const fileUrl = await this.s3Service.BoardImageUpload(file, userId);
      const existingImage = currentImages.find(
        (image) => image.imageUrl === fileUrl,
      );

      if (existingImage) {
        // 이미지가 존재하면 업데이트하지 않고 기존 이미지를 사용
        updatedImages.push(existingImage);
      } else {
        // 이미지가 존재하지 않으면 새 이미지 생성
        const newImage = new CreateBoardImageDto();
        newImage.boardId = boardId;
        newImage.imageUrl = fileUrl;
        const savedImage =
          await this.boardImageRepository.createBoardImage(newImage);
        updatedImages.push(savedImage);
      }
    }

    // 현재 이미지 중 업데이트되지 않은 이미지 삭제
    for (const image of currentImages) {
      if (!updatedImages.some((updatedImage) => updatedImage.id === image.id)) {
        await this.s3Service.deleteImage(image.imageUrl);
        await this.boardImageRepository.deleteBoardImage(image.id);
      }
    }

    return updatedImages;
  }

  // async updateBoardImage(
  //   boardId: number,
  //   files: Express.Multer.File[],
  //   userId: number,
  // ): Promise<CreateBoardImageDto[]> {
  //   const savedImagesArray: CreateBoardImageDto[] = [];
  //   for (const file of files) {
  //     const uploadedImage = await this.s3Service.imgUpload(file, userId);
  //     const newBoardImage = new CreateBoardImageDto();
  //     newBoardImage.boardId = boardId;
  //     newBoardImage.imageUrl = uploadedImage.url;
  //     const savedImage =
  //       await this.boardImageRepository.updateBoardImage(newBoardImage);
  //     savedImagesArray.push(savedImage);
  //   }
  //   return savedImagesArray;
  // }
}
