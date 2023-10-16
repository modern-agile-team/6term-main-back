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
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('BOARDS-LIKE')
@UsePipes(ValidationPipe)
@Controller('boards')
export class BoardsLikeController {
  constructor(private boardsLikeService: BoardsLikeService) {}

  @ApiOperation({ summary: '좋아요 생성' })
  @Post('like/:boardId')
  async addBoardLike(
    @Users() user: User,
    @Param('boardId', ParseIntPipe) boardId: number,
  ) {
    return await this.boardsLikeService.addBoardLike(boardId, user.id);
  }

  @ApiOperation({ summary: '해당 게시글 좋아요 개수 조회' })
  @Get('like/:boardId')
  async getBoardLike(@Param('boardId', ParseIntPipe) boardId: number) {
    return await this.boardsLikeService.getBoardLike(boardId);
  }

  @ApiOperation({ summary: '해당 게시글 좋아요 삭제' })
  @Delete('like/:boardId')
  async deleteBoardLike(
    @Users() user: User,
    @Param('boardId', ParseIntPipe) boardId: number,
  ) {
    return await this.boardsLikeService.deleteBoardLike(boardId, user.id);
  }
}
