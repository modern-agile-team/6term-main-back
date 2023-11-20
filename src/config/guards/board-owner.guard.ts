import { ExecutionContext, Injectable } from '@nestjs/common';
import { TokenService } from 'src/auth/services/token.service';
import { BoardRepository } from 'src/boards/repository/boards.repository';

@Injectable()
export class BoardOwnerGuard {
  constructor(
    private tokenService: TokenService,
    private boardRepository: BoardRepository,
  ) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const accessToken = request.headers['access_token'];
    const boardId = request.query['boardId'];
    if (!accessToken) {
      request.unitowner = false;
      request.user = false;
      return true;
    }
    const userId = await this.tokenService.decodeToken(accessToken);
    const board = await this.boardRepository.findBoardById(boardId);
    const unitowner = board.userId === userId;

    request.unitowner = unitowner;
    request.user = { userId };
    return true;
  }
}
