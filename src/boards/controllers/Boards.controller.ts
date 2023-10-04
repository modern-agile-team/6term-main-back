import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { BoardsService } from '../services/Boards.service';
import { Board } from '../entities/board.entity';
import { CreateBoardDto } from '../dto/create.board.dto';
import { BoardImagesService } from '../services/BoardImage.service';
import { BoardImage } from '../entities/board-image.entity';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('boards')
export class BoardsController {
  constructor(
    private readonly boardsService: BoardsService,
    private readonly boardImagesService: BoardImagesService,
  ) {}

  @Post('/post')
  async create(@Body() createBoardDto: CreateBoardDto): Promise<Board> {
    return this.boardsService.create(createBoardDto);
  }

  @Get('/getall')
  async findAll(): Promise<Board[]> {
    return this.boardsService.findAll();
  }

  @Get(':id/getone')
  async findOne(@Param('id') id: string): Promise<Board | undefined> {
    return this.boardsService.findOne(+id);
  }

  @Put(':id/update')
  async update(
    @Param('id') id: string,
    @Body() boardData: Partial<Board>,
  ): Promise<Board | undefined> {
    return this.boardsService.update(+id, boardData);
  }

  @Delete(':id/delete')
  async remove(@Param('id') id: string): Promise<void> {
    return this.boardsService.remove(+id);
  }

  @Post(':boardId/images')
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(
    @Param('boardId') boardId: Board,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<BoardImage> {
    return this.boardImagesService.create(boardId, file);
  }
}
