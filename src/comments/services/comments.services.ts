import { Injectable } from '@nestjs/common';
import { CommentsRepository } from '../repository/comments.repository';
import { CreateCommentDto } from '../dto/create-comment-dto';
import { Comment } from '../entities/comment.entity';

@Injectable()
export class CommentsService {
  constructor(private CommentRepository: CommentsRepository) {}
  async create(
    commentData: CreateCommentDto,
    userId: number,
    boardId: number,
  ): Promise<Comment> {
    try {
      return await this.CommentRepository.createComment(
        commentData,
        userId,
        boardId,
      );
    } catch (error) {
      console.log(error);
    }
  }
}
