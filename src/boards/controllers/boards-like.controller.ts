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
  UseGuards,
} from '@nestjs/common';
import { BoardsLikeService } from '../services/boards-like.service';
import { ApiTags } from '@nestjs/swagger';
import { ApiAddBoardLike } from '../swagger-decorators/add-board-like.decorator';
import { ApiGetBoardLikeCount } from '../swagger-decorators/get-board-like-count.decorator';
import { ApiDeleteBoardLike } from '../swagger-decorators/delete-board-like.decorator';
import { TokenService } from 'src/auth/services/token.service';
import { GetUserId } from 'src/common/decorators/get-userId.decorator';
import { JwtAccessTokenGuard } from 'src/config/guards/jwt-access-token.guard';

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
  @UseGuards(JwtAccessTokenGuard)
  async addBoardLike(
    @GetUserId() userId: number,
    @Param('boardId', ParseIntPipe) boardId: number,
  ) {
    return this.boardsLikeService.addBoardLike(boardId, userId);
  }

  @ApiGetBoardLikeCount()
  @Get('like')
  @UseGuards(JwtAccessTokenGuard)
  async getBoardsLike(
    @GetUserId() userId: number,
    @Query('boardId', ParseIntPipe) boardId: number,
  ) {
    try {
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
  @UseGuards(JwtAccessTokenGuard)
  async deleteBoardLike(
    @GetUserId() userId: number,
    @Param('boardId', ParseIntPipe)
    boardId: number,
  ) {
    return this.boardsLikeService.deleteBoardLike(boardId, userId);
  }
}
