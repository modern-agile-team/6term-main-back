import {
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { BoardsLikeService } from '../services/boards-like.service';
import { Users } from 'src/common/decorators/user.decorator';
import { User } from 'src/users/entities/user.entity';

@Controller('boards')
export class BoardsLikeController {
  constructor(private boardsLikeService: BoardsLikeService) {}

  @Post('like/:boardId/')
  async addBoardLike(
    @Users() user: User,
    @Param('boardId', ParseIntPipe) boardId: number,
  ) {
    return await this.boardsLikeService.addBoardLike(boardId, user.id);
  }

  @Get('like/:boardId')
  async getBoardLike(@Param('boardId', ParseIntPipe) boardId: number) {
    return await this.boardsLikeService.getBoardLike(boardId);
  }

  @Delete('like/:boardId/')
  async deleteBoardLike(
    @Users() user: User,
    @Param('boardId', ParseIntPipe) boardId: number,
  ) {
    return await this.boardsLikeService.deleteBoardLike(boardId, user.id);
  }
}
