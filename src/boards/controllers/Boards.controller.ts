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
  Headers,
} from '@nestjs/common';
import { BoardsService } from '../services/Boards.service';
import { Board } from '../entities/board.entity';
import { CreateBoardDto } from '../dto/create.board.dto';
import { BoardImagesService } from '../services/BoardImage.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { BoardResponseDTO } from '../dto/boards.response.dto';
import { CreateBoardImageDto } from '../dto/create.board-image.dto';
import { TokenService } from 'src/auth/services/token.service';

@Controller('boards')
export class BoardsController {
  constructor(
    private readonly boardsService: BoardsService,
    private readonly boardImagesService: BoardImagesService,
    private tokenService: TokenService,
  ) {}

  @Post()
  async create(
    @Headers('accessToken') accessToken: string,
    @Body() createBoardDto: CreateBoardDto,
  ): Promise<Board> {
    const userId = await this.tokenService.decodeToken(accessToken);
    return await this.boardsService.create(createBoardDto, userId);
  }

  @Post(':boardId/images')
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(
    @Param('boardId') boardId: number,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<CreateBoardImageDto> {
    return await this.boardImagesService.createBoardImages(boardId, file);
  }

  @Get()
  async findPageBoards(
    @Query('page') page = 1,
    @Query('limit') limit = 30,
  ): Promise<BoardResponseDTO[]> {
    return await this.boardsService.findPagedBoards(page, limit);
  }

  @Get(':boardId')
  async findOne(
    @Param('boardId') boardId: string,
  ): Promise<BoardResponseDTO | undefined> {
    return await this.boardsService.findOneBoard(+boardId);
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
  async deleteBoard(
    @Headers('accessToken') accessToken: string,
    @Param('boardId') boardId: number,
  ) {
    const userId = await this.tokenService.decodeToken(accessToken);
    await this.boardsService.deleteBoard(boardId, userId);
  }
}
