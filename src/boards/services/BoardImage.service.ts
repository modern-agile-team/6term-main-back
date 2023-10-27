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
