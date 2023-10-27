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
import { Users } from 'src/common/decorators/user.decorator';
import { User } from 'src/users/entities/user.entity';
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
  @Get('/like')
  async getBoardsLike(@Query('boardId') boardId: number) {
    return this.boardsLikeService.getBoardLikes(boardId);
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
