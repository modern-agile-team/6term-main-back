import { Controller, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { BoardsLikeService } from './boards-like.service';

@Controller('boards')
export class BoardsLikeController {
  constructor(private boardsLikeService: BoardsLikeService) {}

  @Post('like/:boardId/:userId')
  async addBoardLike(
    @Param('boardId', ParseIntPipe) boardId: number,
    @Param('userId', ParseIntPipe) userId: number,
  ) {
    return await this.boardsLikeService.addBoardLike(boardId, userId);
  }

  @Get('like/:boardId')
  async getBoardLike(@Param('boardId', ParseIntPipe) boardId: number) {
    return await this.boardsLikeService.getBoardLike(boardId);
  }
}
