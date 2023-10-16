import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UploadedFile,
  UseInterceptors,
  Query,
} from '@nestjs/common';
import { BoardsService } from '../services/Boards.service';
import { Board } from '../entities/board.entity';
import { CreateBoardDto } from '../dto/create.board.dto';
import { BoardImagesService } from '../services/BoardImage.service';
import { BoardImage } from '../entities/board-image.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { BoardResponseDTO } from '../dto/boards.response.dto';

@Controller('boards')
export class BoardsController {
  constructor(
    private readonly boardsService: BoardsService,
    private readonly boardImagesService: BoardImagesService,
  ) {}

  @Post()
  async create(@Body() createBoardDto: CreateBoardDto): Promise<Board> {
    return this.boardsService.create(createBoardDto);
  }

  @Post(':boardId/images')
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(
    @Param('boardId') boardId: number,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<BoardImage> {
    return this.boardImagesService.createBoardImages(boardId, file);
  }

  @Get()
  async findPageBoards(
    @Query('page') page = 1,
    @Query('limit') limit = 30,
  ): Promise<BoardResponseDTO[]> {
    return this.boardsService.findPagedBoards(page, limit);
  }

  @Get(':boardId')
  async findOne(
    @Param('boardId') boardId: string,
  ): Promise<BoardResponseDTO | undefined> {
    return this.boardsService.findOneBoard(+boardId);
  }

  @Patch(':boardId')
  async editBoard(
    @Param('boardId') boardId: string,
    @Body() boardData: Partial<Board>,
  ): Promise<Board> {
    const updatedBoard = await this.boardsService.updateBoard(
      +boardId,
      boardData,
    );
    return updatedBoard;
  }

  @Delete(':boardId')
  async deleteBoard(@Param('boardId') boardId: number): Promise<void> {
    const userId = 1; // 임시로 1 받아오는겁니다 (토큰 완성되면 수정예정)
    await this.boardsService.deleteBoard(boardId, userId);
  }
}
