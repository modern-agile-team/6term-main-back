import {
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UsePipes,
  ValidationPipe,
  Query,
  Headers,
} from '@nestjs/common';
import { BoardsLikeService } from '../services/boards-like.service';
import { ApiTags } from '@nestjs/swagger';
import { ApiAddBoardLike } from '../swagger-decorators/add-board-like.decorator';
import { ApiGetBoardLikeCount } from '../swagger-decorators/get-board-like-count.decorator';
import { ApiDeleteBoardLike } from '../swagger-decorators/delete-board-like.decorator';
import { TokenService } from 'src/auth/services/token.service';

@ApiTags('BOARDS-LIKE')
@UsePipes(ValidationPipe)
@Controller('boards')
export class BoardsLikeController {
  constructor(
    private tokenService: TokenService,
    private boardsLikeService: BoardsLikeService,
  ) {}

  @ApiAddBoardLike()
  @Post('like/:boardId')
  async addBoardLike(
    @Headers('access_token') accessToken: string,
    @Param('boardId', ParseIntPipe) boardId: number,
  ) {
    const userId = await this.tokenService.decodeToken(accessToken);
    return this.boardsLikeService.addBoardLike(boardId, userId);
  }

  @ApiGetBoardLikeCount()
  @Get('like')
  async getBoardsLike(
    @Headers('access_token') accessToken: string,
    @Query('boardId', ParseIntPipe) boardId: number,
  ) {
    try {
      const userId = await this.tokenService.decodeToken(accessToken);

      return this.boardsLikeService.getBoardLikesAndIsLike(boardId, userId);
    } catch (error) {
      if (
        (error.status === 401 &&
          error.message === '유효하지 않은 토큰입니다.') ||
        (error.status === 403 && error.message === '만료된 토큰입니다.') ||
        (error.status === 404 &&
          error.message === '사용자를 찾을 수 없습니다.') ||
        (error.status === 411 &&
          error.message === '토큰이 제공되지 않았습니다.')
      ) {
        return this.boardsLikeService.getBoardLikes(boardId);
      }
      console.error(error);
      throw error;
    }
  }

  @ApiDeleteBoardLike()
  @Delete('like/:boardId')
  async deleteBoardLike(
    @Headers('access_token') accessToken: string,
    @Param('boardId', ParseIntPipe)
    boardId: number,
  ) {
    const userId = await this.tokenService.decodeToken(accessToken);
    return this.boardsLikeService.deleteBoardLike(boardId, userId);
  }
}
