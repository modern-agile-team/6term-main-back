import {
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { BoardsLikeService } from '../services/boards-like.service';
import { Users } from 'src/common/decorators/user.decorator';
import { User } from 'src/users/entities/user.entity';
import { ApiTags } from '@nestjs/swagger';
import { ApiAddBoardLike } from '../swagger-descorators/add-board-like.decorator';
import { ApiGetBoardLikeCount } from '../swagger-descorators/get-board-like-count.decorator';
import { ApiDeleteBoardLike } from '../swagger-descorators/delete-board-like.decorator';

@ApiTags('BOARDS-LIKE')
@UsePipes(ValidationPipe)
@Controller('boards')
export class BoardsLikeController {
  constructor(private boardsLikeService: BoardsLikeService) {}

  @ApiAddBoardLike()
  @Post('like/:boardId')
  async addBoardLike(
    @Users() user: User,
    @Param('boardId', ParseIntPipe) boardId: number,
  ) {
    return this.boardsLikeService.addBoardLike(boardId, user.id);
  }

  @ApiGetBoardLikeCount()
  @Get('like/:boardId')
  async getBoardLike(@Param('boardId', ParseIntPipe) boardId: number) {
    return this.boardsLikeService.getBoardLike(boardId);
  }

  @ApiDeleteBoardLike()
  @Delete('like/:boardId')
  async deleteBoardLike(
    @Users() user: User,
    @Param('boardId', ParseIntPipe)
    boardId: number,
  ) {
    return this.boardsLikeService.deleteBoardLike(boardId, user.id);
  }
}
