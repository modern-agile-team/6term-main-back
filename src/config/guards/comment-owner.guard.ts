import { ExecutionContext, Injectable } from '@nestjs/common';
import { TokenService } from 'src/auth/services/token.service';
import { CommentsRepository } from 'src/comments/repository/comments.repository';

@Injectable()
export class CommentOwnerGuard {
  constructor(
    private tokenService: TokenService,
    private commentRepository: CommentsRepository,
  ) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const accessToken = request.headers['access_token'];
    const boardId = request.query['boardId'];
    if (!accessToken) {
      request.commentOwner = false;
      request.recommentOwner = false;
      request.user = false;
      return true;
    }
    const userId = await this.tokenService.decodeToken(accessToken);
    const comments =
      await this.commentRepository.findCommentsByBoardId(boardId);
    const commentOwner = comments.map((comment) => ({
      commentOnwer: comment.userId === userId,
    }));
    const recommentOwner = comments.map((recomment) => ({
      recommentOwner: recomment.userId === userId,
    }));
    // const commentOwner = comments.userId === userId;
    // const recommentOwner = comments.reComment.userId === userId;

    request.commentOwner = commentOwner;
    request.recommentOwner = recommentOwner;
    request.user = { userId };
    return true;
  }
}
