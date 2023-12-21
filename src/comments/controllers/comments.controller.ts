import {
  Controller,
  Post,
  Body,
  Query,
  Get,
  Patch,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { Comment } from '../entities/comment.entity';
import { ApiTags } from '@nestjs/swagger';
import { CommentsService } from '../services/comments.services';
import { CreateCommentDto } from '../dto/create-comment-dto';
import { ApiAddComment } from '../swagger-decoratros/add-comment-decorators';
import { ApiGetAllComment } from '../swagger-decoratros/get-all-comment-decorators';
import { commentResponseDTO } from '../dto/get-all-comment-dto';
import { ApiUpdateComment } from '../swagger-decoratros/patch-comment-decorators';
import { ApiDeleteComment } from '../swagger-decoratros/delete-comment-decorator';
import { ReCommentsService } from '../services/recomments.services';
import { CreateReCommentDto } from '../dto/create-recomment-dto';
import { ReComment } from '../entities/recomment.entity';
import { ApiAddReComment } from '../swagger-decoratros/add-recomment-decorators';
import { ApiUpdateReComment } from '../swagger-decoratros/patch-recomment-decorator';
import { JwtAccessTokenGuard } from 'src/config/guards/jwt-access-token.guard';
import { GetUserId } from 'src/common/decorators/get-userId.decorator';

@Controller('comments')
@ApiTags('Comment API')
export class CommentsController {
  constructor(
    private readonly commentsService: CommentsService,
    private readonly recommentsService: ReCommentsService,
  ) {}

  @Post('')
  @UseGuards(JwtAccessTokenGuard)
  @ApiAddComment()
  async createComment(
    @GetUserId() userId: number,
    @Query('boardId') boardId: number,
    @Body() createCommentDto: CreateCommentDto,
  ): Promise<Comment> {
    return await this.commentsService.create(createCommentDto, userId, boardId);
  }

  @Post('/Re')
  @UseGuards(JwtAccessTokenGuard)
  @ApiAddReComment()
  async createReComment(
    @GetUserId() userId: number,
    @Query('commentId') commentId: number,
    @Body() createReCommentDto: CreateReCommentDto,
  ): Promise<ReComment> {
    return await this.recommentsService.create(
      createReCommentDto,
      userId,
      commentId,
    );
  }

  @Get('')
  @UseGuards(JwtAccessTokenGuard)
  @ApiGetAllComment()
  async getComment(
    @GetUserId() userId: number,
    @Query('boardId') boardId: number,
  ): Promise<commentResponseDTO[]> {
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

  @Patch('/Re')
  @ApiUpdateReComment()
  async updateReComment(
    @Query('reCommentId') reCommentId: number,
    @Body() recommentData: Partial<ReComment>,
  ): Promise<ReComment> {
    return this.recommentsService.updateReComment(reCommentId, recommentData);
  }

  @Delete('')
  @UseGuards(JwtAccessTokenGuard)
  @ApiDeleteComment()
  async deleteComment(
    @Query('commentId') commentId: number,
    @GetUserId() userId: number,
  ) {
    await this.commentsService.deleteComment(commentId, userId);
  }

  @Delete('/Re')
  @UseGuards(JwtAccessTokenGuard)
  @ApiDeleteComment()
  async deleteReComment(
    @Query('reCommentId') reCommentId: number,
    @GetUserId() userId: number,
  ) {
    await this.recommentsService.deleteReComment(reCommentId, userId);
  }
}
