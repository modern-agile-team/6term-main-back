import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { CreateCommentDto } from '../dto/create-comment-dto';
import { Comment } from '../entities/comment.entity';

@Injectable()
export class CommentsRepository {
  constructor(private readonly entityManager: EntityManager) {}
  async createComment(
    commentData: CreateCommentDto,
    userId: number,
    boardId: number,
  ): Promise<Comment> {
    const comment = new Comment();
    comment.content = commentData.content;
    comment.userId = userId;
    comment.boardId = boardId;
    return await this.entityManager.save(Comment, comment);
  }
}
