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
      const uploadedImage = await this.s3Service.uploadImage(
        file,
        userId,
        'BoadImages/',
      );
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
    deleteImageUrl: string,
  ): Promise<any> {
    const existingImages =
      await this.boardImageRepository.getBoardImages(boardId);

    const imagesToDelete = existingImages.filter(
      (image) => image.imageUrl === deleteImageUrl,
    );
    const s3ToDelete = imagesToDelete.map((image) => {
      const parts = image.imageUrl.split('/');
      const fileName = parts[parts.length - 1];
      return 'BoardImages/' + fileName;
    });

    await this.boardImageRepository.deleteImages(imagesToDelete);
    await this.s3Service.deleteImage(s3ToDelete.join(','));

    const newImagesArray: CreateBoardImageDto[] = [];
    for (const file of files) {
      const uploadedImage = await this.s3Service.uploadImage(
        file,
        userId,
        'BoardImages/',
      );
      const boardImage = new CreateBoardImageDto();
      boardImage.boardId = boardId;
      boardImage.imageUrl = uploadedImage.url;
      const savedImage =
        await this.boardImageRepository.saveBoardImage(boardImage);
      newImagesArray.push(savedImage);
    }
    return {
      message: '이미지 업데이트 및 삭제가 성공적으로 처리되었습니다.',
      newImagesArray,
    };
  }
}
