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
import { ApiUploadBoardImages } from '../swagger-decorators/upload-baord-images-decorator';
import { ApiAddBoard } from '../swagger-decorators/add-board-decorators';
import { ApiGetPageBoards } from '../swagger-decorators/get-page-boards-decorators';
import { ApiGetOneBoard } from '../swagger-decorators/get-one-board-decorators';
import { ApiUpdateBoard } from '../swagger-decorators/patch-board-decorators';
import { ApiTags } from '@nestjs/swagger';
import { ApiDeleteBoard } from '../swagger-decorators/delete-board-decorators';

@Controller('boards')
@ApiTags('board API')
export class BoardsController {
  constructor(
    private readonly boardsService: BoardsService,
    private readonly boardImagesService: BoardImagesService,
    private tokenService: TokenService,
  ) {}

  @Post('')
  @ApiAddBoard()
  async create(
    @Headers('access_token') accessToken: string,
    @Body() createBoardDto: CreateBoardDto,
  ): Promise<Board> {
    const userId = await this.tokenService.decodeToken(accessToken);
    return await this.boardsService.create(createBoardDto, userId);
  }

  @Post('/images')
  @UseInterceptors(FilesInterceptor('files', 3))
  @ApiUploadBoardImages()
  async uploadImage(
    @Headers('access_token') accesstoken: string,
    @Query('boardId') boardId: number,
    @UploadedFiles() files: Express.Multer.File[],
  ): Promise<CreateBoardImageDto[]> {
    const userId = await this.tokenService.decodeToken(accesstoken);
    console.log(files);

    return await this.boardImagesService.createBoardImages(
      boardId,
      files,
      userId,
    );
  }

  @Get('')
  @ApiGetPageBoards()
  async findPageBoards(
    @Query('page') page = 1,
    @Query('limit') limit = 30,
  ): Promise<{ data: BoardResponseDTO[]; total: number }> {
    return await this.boardsService.findPagedBoards(page, limit);
  }

  @Get('/unit')
  @ApiGetOneBoard()
  async findOne(
    @Query('boardId') boardId: number,
    @Headers('access_token') accesstoken: string,
  ): Promise<BoardResponseDTO> {
    ``;
    const userId = await this.tokenService.decodeToken(accesstoken);
    return await this.boardsService.findOneBoard(boardId, userId);
  }

  @Patch('')
  @ApiUpdateBoard()
  async editBoard(
    @Query('boardId') boardId: number,
    @Body() boardData: Partial<Board>,
  ): Promise<Board> {
    return await this.boardsService.updateBoard(boardId, boardData);
  }

  @Patch('/images')
  @UseInterceptors(FilesInterceptor('files', 3))
  async editBoardImages(
    @Headers('access_token') accessToken: string,
    @Query('boardId') boardId: number,
    @Query('deleteImageUrl') deleteImageUrl: string,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    const userId = await this.tokenService.decodeToken(accessToken);
    return await this.boardImagesService.updateBoardImages(
      boardId,
      files,
      userId,
      deleteImageUrl,
    );
  }

  @Delete('')
  @ApiDeleteBoard()
  async deleteBoard(
    @Query('boardId') boardId: number,
    @Headers('access_token') accessToken: string,
  ) {
    const userId = await this.tokenService.decodeToken(accessToken);
    await this.boardsService.deleteBoard(boardId, userId);
  }
}
