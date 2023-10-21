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
    files: Express.Multer.File,
  ): Promise<CreateBoardImageDto> {
    const userId = 1; // 임시 사용자 id입니다
    const uploadedImage = await this.s3Service.imgUpload(files, userId);
    const boardImage = new CreateBoardImageDto();
    boardImage.boardId = boardId;
    boardImage.imageUrl = uploadedImage.url;

    const savedImage =
      await this.boardImageRepository.saveBoardImage(boardImage);

    return savedImage;
  }
}
