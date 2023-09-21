import {
  Controller,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { BoardImagesService } from '../service/BoardImage.service';
import { BoardImage } from '../entities/board-image.entity'; // BoardImage 엔티티 임포트
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('boardimages')
export class BoardImagesController {
  constructor(private readonly boardImagesService: BoardImagesService) {}

  @Post(':boardId')
  @UseInterceptors(FileInterceptor('file')) // 'file'은 업로드할 파일 필드의 이름입니다.
  async create(
    @Param('boardId') boardId: number,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<BoardImage> {
    return this.boardImagesService.create(boardId, file);
  }
}
