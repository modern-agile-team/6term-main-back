import {
  Controller,
  Post,
  Body,
  Headers,
  Query,
  Get,
  Patch,
  Delete,
} from '@nestjs/common';
import { Comment } from '../entities/comment.entity';
import { ApiTags } from '@nestjs/swagger';
import { CommentsService } from '../services/comments.services';
import { TokenService } from 'src/auth/services/token.service';
import { CreateCommentDto } from '../dto/create-comment-dto';
import { ApiAddComment } from '../swagger-decoratros/add-comment-decorators';
import { ApiGetAllComment } from '../swagger-decoratros/get-all-comment-decoratros';
import { commentResponseDTO } from '../dto/get-all-comment-dto';
import { ApiUpdateComment } from '../swagger-decoratros/patch-comment-decoratros';
import { ApiDeleteComment } from '../swagger-decoratros/delete-comment-decorator';

@Controller('comments')
@ApiTags('Comment API')
export class CommentsController {
  constructor(
    private readonly commentsService: CommentsService,
    private tokenService: TokenService,
  ) {}

  @Post('')
  @ApiAddComment()
  async createComment(
    @Headers('access_token') accessToken: string,
    @Query('boardId') boardId: number,
    @Body() createCommentDto: CreateCommentDto,
  ): Promise<Comment> {
    const userId = await this.tokenService.decodeToken(accessToken);
    return await this.commentsService.create(createCommentDto, userId, boardId);
  }

  @Get('')
  @ApiGetAllComment()
  async getComment(
    @Headers('access_token') accessToken: string,
    @Query('boardId') boardId: number,
  ): Promise<commentResponseDTO[]> {
    const userId = await this.tokenService.decodeToken(accessToken);
    return this.commentsService.findAllComments(boardId, userId);
  }

  @Patch('')
  @ApiUpdateComment()
  async updateComment(
    @Query('commentId') commentId: number,
    @Body() commentData: Partial<Comment>,
  ): Promise<Comment> {
    return this.commentsService.updateComment(commentId, commentData);
  }

  @Delete('')
  @ApiDeleteComment()
  async deleteComment(
    @Query('commentId') commentId: number,
    @Headers('access_token') accessToken: string,
  ) {
    const userId = await this.tokenService.decodeToken(accessToken);
    await this.commentsService.deleteComment(commentId, userId);
  }
}
