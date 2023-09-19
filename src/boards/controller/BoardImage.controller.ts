// boardimages.controller.ts

import { Controller, Param, Post, Get } from '@nestjs/common';
import { BoardImagesService } from '../service/BoardImage.service';
import { BoardImage } from '../entities/board-image.entity';
// import { S3Service } from 'src/common/s3/s3.service';

@Controller('boardimages')
export class BoardImagesController {
  constructor(private readonly boardImagesService: BoardImagesService) {}

  @Post(':boardId')
  async create(@Param('boardId') boardId: number): Promise<BoardImage> {
    return this.boardImagesService.create(boardId);
  }

  @Get(':boardId')
  async findByBoardId(
    @Param('boardId') boardId: number,
  ): Promise<BoardImage[]> {
    return this.boardImagesService.findByBoardId(boardId);
  }
}
