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
  ParseIntPipe,
} from '@nestjs/common';
import { BoardsService } from '../services/Boards.service';
import { Board } from '../entities/board.entity';
import { CreateBoardDto } from '../dto/create.board.dto';
import { BoardImagesService } from '../services/BoardImage.service';
import { BoardImage } from '../entities/board-image.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { BoardResponseDTO } from '../dto/boards.response.dto';
import { Users } from 'src/common/decorators/decorators';
import { User } from 'src/users/entities/user.entity';

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
    return this.boardImagesService.create(boardId, file);
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
  async update(
    @Param('boardId') boardId: string,
    @Body() boardData: Partial<Board>,
  ): Promise<Board> {
    const updatedBoard = await this.boardsService.update(+boardId, boardData);
    return updatedBoard;
  }

  @Delete()
  async deleteBoardbyId(
    @Users() user: User,
    @Param('boardId', ParseIntPipe) boardId: number,
  ): Promise<void> {
    return await this.boardsService.deleteBoard(boardId, user.id);
  }
}
