import {
  Controller,
  // Get,
  Post,
  Body,
  // Patch,
  // Delete,
  Headers,
  Query,
} from '@nestjs/common';
import { Comment } from '../entities/comment.entity';
import { ApiTags } from '@nestjs/swagger';
import { CommentsService } from '../services/comments.services';
import { TokenService } from 'src/auth/services/token.service';
import { CreateCommentDto } from '../dto/create-comment-dto';

@Controller('comments')
@ApiTags('Comment API')
export class CommentsController {
  constructor(
    private readonly commentsService: CommentsService,
    private tokenService: TokenService,
  ) {}

  @Post('')
  async createComment(
    @Headers('access_token') accessToken: string,
    @Query('boardId') boardId: number,
    @Body() createCommentDto: CreateCommentDto,
  ): Promise<Comment> {
    const userId = await this.tokenService.decodeToken(accessToken);
    return await this.commentsService.create(createCommentDto, userId, boardId);
  }
}
