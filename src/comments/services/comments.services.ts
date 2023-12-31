import { Injectable } from '@nestjs/common';
import { CommentsRepository } from '../repository/comments.repository';
import { CreateCommentDto } from '../dto/create-comment-dto';
import { Comment } from '../entities/comment.entity';
import { commentResponseDTO } from '../dto/get-all-comment-dto';
import { UpdateCommentDto } from '../dto/update-comment-dto';

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

  async findAllComments(
    boardId: number,
    userId: number,
  ): Promise<commentResponseDTO[]> {
    const comments =
      await this.CommentRepository.findCommentsByBoardId(boardId);
    if (!comments) {
      return []; // 에러 말고 리턴으로 빈 배열
    }
    return comments.map((comment) => ({
      id: comment.id,
      content: comment.content,
      commentowner: comment.userId === userId,
      user: {
        name: comment.user.name,
        userImage: comment.user.userImage ? comment.user.userImage : [],
      },
      reComment: (comment.reComment || []).map((reComment) => ({
        //예외처리 , reComment가 없을경우 빈 배열
        id: reComment.id,
        content: reComment.content,
        reCommentowner: reComment.userId === userId,
        user: {
          name: reComment.user.name,
          userImage: reComment.user.userImage ? reComment.user.userImage : [],
        },
      })),
    }));
  }

  async updateComment(
    commentId: number,
    commentData: Partial<UpdateCommentDto>,
  ): Promise<Comment | undefined> {
    const existingComment =
      await this.CommentRepository.findOneComment(commentId);
    for (const key in commentData) {
      if (commentData.hasOwnProperty(key)) {
        existingComment[key] = commentData[key];
      }
    }
    const updatedComment = await this.CommentRepository.updateComment(
      commentId,
      existingComment,
    );
    return updatedComment;
  }

  async deleteComment(commentId: number, userId: number): Promise<void> {
    const comment = await this.CommentRepository.findOneComment(commentId);

    if (!comment) {
      throw new Error('존재하지 않는 댓글입니다.');
    }

    if (comment.userId !== userId) {
      throw new Error('작성한 댓글이 아닙니다.');
    }
    await this.CommentRepository.deleteComment(comment);
  }
}
