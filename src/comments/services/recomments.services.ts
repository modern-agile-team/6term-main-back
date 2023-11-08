import { Injectable } from '@nestjs/common';
import { CreateReCommentDto } from '../dto/create-recomment-dto';

import { ReComment } from '../entities/recomment.entity';
import { ReCommentsRepository } from '../repository/recomments.repository';
import { UpdateReCommentDto } from '../dto/update-recomment-dto';

@Injectable()
export class ReCommentsService {
  constructor(private reCommentRepository: ReCommentsRepository) {}
  async create(
    recommentData: CreateReCommentDto,
    userId: number,
    commentId: number,
  ): Promise<ReComment> {
    try {
      return await this.reCommentRepository.createReComment(
        recommentData,
        userId,
        commentId,
      );
    } catch (error) {
      console.log(error);
    }
  }

  async updateReComment(
    reCommentId: number,
    reCommentData: Partial<UpdateReCommentDto>,
  ): Promise<ReComment | undefined> {
    const existingComment =
      await this.reCommentRepository.findOneReComment(reCommentId);
    for (const key in reCommentData) {
      if (reCommentData.hasOwnProperty(key)) {
        existingComment[key] = reCommentData[key];
      }
    }
    const updatedReComment = await this.reCommentRepository.updateReComment(
      reCommentId,
      existingComment,
    );
    return updatedReComment;
  }

  async deleteReComment(reCommentId: number, userId: number): Promise<void> {
    const reComment =
      await this.reCommentRepository.findOneReComment(reCommentId);

    if (!reComment) {
      throw new Error('존재하지 않는 댓글입니다.');
    }

    if (reComment.userId !== userId) {
      throw new Error('작성한 댓글이 아닙니다.');
    }
    await this.reCommentRepository.deleteReComment(reComment);
  }
}
