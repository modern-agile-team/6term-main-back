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
  UseInterceptors,
} from '@nestjs/common';
import { BoardsLikeService } from '../services/boards-like.service';
import { ApiTags } from '@nestjs/swagger';
import { ApiAddBoardLike } from '../swagger-decorators/add-board-like.decorator';
import { ApiGetBoardLikeCount } from '../swagger-decorators/get-board-like-count.decorator';
import { ApiDeleteBoardLike } from '../swagger-decorators/delete-board-like.decorator';
import { TokenService } from 'src/auth/services/token.service';
import { GetUserId } from 'src/common/decorators/get-userId.decorator';
import { JwtAccessTokenGuard } from 'src/config/guards/jwt-access-token.guard';
import { JwtOptionalGuard } from 'src/config/guards/jwt-optional.guard';
import { SuccessResponseInterceptor } from 'src/common/interceptors/success-response.interceptor';

@ApiTags('BOARDS-LIKE')
@UsePipes(ValidationPipe)
@UseInterceptors(SuccessResponseInterceptor)
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
  @UseGuards(JwtOptionalGuard)
  async getBoardsLike(
    @GetUserId() userId: number,
    @Query('boardId', ParseIntPipe) boardId: number,
  ) {
    if (userId === undefined) {
      return this.boardsLikeService.getBoardLikes(boardId);
    }

    return this.boardsLikeService.getBoardLikesAndIsLike(boardId, userId);
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
