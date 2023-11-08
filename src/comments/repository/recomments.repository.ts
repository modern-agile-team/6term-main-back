import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { ReComment } from '../entities/recomment.entity';
import { CreateReCommentDto } from '../dto/create-recomment-dto';

@Injectable()
export class ReCommentsRepository {
  constructor(private readonly entityManager: EntityManager) {}
  async createReComment(
    recommentData: CreateReCommentDto,
    userId: number,
    commentId: number,
  ): Promise<ReComment> {
    const reComment = new ReComment();
    reComment.content = recommentData.content;
    reComment.userId = userId;
    reComment.commentId = commentId;
    return await this.entityManager.save(ReComment, reComment);
  }

  async findOneReComment(id: number): Promise<ReComment> {
    return this.entityManager.findOne(ReComment, {
      relations: ['user', 'user.userImage'],
      where: { id },
    });
  }

  async updateReComment(
    id: number,
    commentData: Partial<CreateReCommentDto>,
  ): Promise<ReComment> {
    const existingReComment = await this.entityManager.findOne(ReComment, {
      relations: ['user', 'user.userImage'],
      where: { id },
    });
    for (const key in commentData) {
      if (commentData.hasOwnProperty(key)) {
        existingReComment[key] = commentData[key];
      }
    }
    await this.entityManager.save(ReComment, existingReComment);
    return existingReComment;
  }

  async deleteReComment(reComment: ReComment): Promise<void> {
    await this.entityManager.remove(ReComment, reComment);
  }
}
