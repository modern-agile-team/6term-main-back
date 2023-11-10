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
import { ApiGetAllComment } from '../swagger-decoratros/get-all-comment-decorators';
import { commentResponseDTO } from '../dto/get-all-comment-dto';
import { ApiUpdateComment } from '../swagger-decoratros/patch-comment-decorators';
import { ApiDeleteComment } from '../swagger-decoratros/delete-comment-decorator';
import { ReCommentsService } from '../services/recomments.services';
import { CreateReCommentDto } from '../dto/create-recomment-dto';
import { ReComment } from '../entities/recomment.entity';
import { ApiAddReComment } from '../swagger-decoratros/add-recomment-decorators';
import { ApiUpdateReComment } from '../swagger-decoratros/patch-recomment-decorator';

@Controller('comments')
@ApiTags('Comment API')
export class CommentsController {
  constructor(
    private readonly commentsService: CommentsService,
    private readonly recommentsService: ReCommentsService,
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

  @Post('/Re')
  @ApiAddReComment()
  async createReComment(
    @Headers('access_token') accessToken: string,
    @Query('commentId') commentId: number,
    @Body() createReCommentDto: CreateReCommentDto,
  ): Promise<ReComment> {
    const userId = await this.tokenService.decodeToken(accessToken);
    return await this.recommentsService.create(
      createReCommentDto,
      userId,
      commentId,
    );
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

  @Patch('/Re')
  @ApiUpdateReComment()
  async updateReComment(
    @Query('reCommentId') reCommentId: number,
    @Body() recommentData: Partial<ReComment>,
  ): Promise<ReComment> {
    return this.recommentsService.updateReComment(reCommentId, recommentData);
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

  @Delete('/Re')
  @ApiDeleteComment()
  async deleteReComment(
    @Query('reCommentId') reCommentId: number,
    @Headers('access_token') accessToken: string,
  ) {
    const userId = await this.tokenService.decodeToken(accessToken);
    await this.recommentsService.deleteReComment(reCommentId, userId);
  }
}
