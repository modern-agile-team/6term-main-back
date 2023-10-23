import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Delete,
  UseInterceptors,
  Query,
  Headers,
  UploadedFiles,
} from '@nestjs/common';
import { BoardsService } from '../services/Boards.service';
import { Board } from '../entities/board.entity';
import { CreateBoardDto } from '../dto/create.board.dto';
import { BoardImagesService } from '../services/BoardImage.service';
import { FilesInterceptor } from '@nestjs/platform-express';
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

  @Post('')
  async create(
    @Headers('access_token') accessToken: string,
    @Body() createBoardDto: CreateBoardDto,
  ): Promise<Board> {
    const userId = await this.tokenService.decodeToken(accessToken);
    return await this.boardsService.create(createBoardDto, userId);
  }

  @Post('/images')
  @UseInterceptors(FilesInterceptor('files', 3))
  async uploadImage(
    @Headers('access_token') accesstoken: string,
    @Query('boardId') boardId: number,
    @UploadedFiles() files: Express.Multer.File[],
  ): Promise<CreateBoardImageDto[]> {
    const userId = await this.tokenService.decodeToken(accesstoken);
    return await this.boardImagesService.createBoardImages(
      boardId,
      files,
      userId,
    );
  }

  @Get('')
  async findPageBoards(
    @Query('page') page = 1,
    @Query('limit') limit = 30,
  ): Promise<{ data: BoardResponseDTO[]; total: number }> {
    return await this.boardsService.findPagedBoards(page, limit);
  }

  @Get('/unit')
  async findOne(@Query('boardId') boardId: number): Promise<BoardResponseDTO> {
    return await this.boardsService.findOneBoard(boardId);
  }

  @Patch('')
  async editBoard(
    @Query('boardId') boardId: number,
    @Body() boardData: Partial<Board>,
  ): Promise<Board> {
    const updatedBoard = await this.boardsService.updateBoard(
      boardId,
      boardData,
    );
    return updatedBoard;
  }

  @Delete('')
  async deleteBoard(
    @Query('boardId') boardId: number,
    @Headers('access_token') accessToken: string,
  ) {
    const userId = await this.tokenService.decodeToken(accessToken);
    await this.boardsService.deleteBoard(boardId, userId);
  }
}
