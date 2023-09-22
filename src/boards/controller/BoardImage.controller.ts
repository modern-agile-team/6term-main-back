import {
  Controller,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { BoardImagesService } from '../service/BoardImage.service';
import { BoardImage } from '../entities/board-image.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { Board } from '../entities/board.entity';

@Controller('boardimages')
export class BoardImagesController {
  constructor(private readonly boardImagesService: BoardImagesService) {}

  @Post(':boardId')
  @UseInterceptors(FileInterceptor('file'))
  async create(
    @Param('boardId') boardId: Board,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<BoardImage> {
    return this.boardImagesService.create(boardId, file);
  }
}
