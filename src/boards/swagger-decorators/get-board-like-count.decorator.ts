import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

export function ApiGetBoardLikeCount() {
  return applyDecorators(
    ApiOperation({
      summary: '해당 게시글 좋아요 개수 조회',
      description: 'Headers - access_token, Param - board-id',
    }),
    ApiResponse({
      status: 200,
      description:
        '좋아요 조회 성공. 토큰이 담겨서 왔고, 해당 유저가 좋아요를 누른 경우',
      content: {
        JSON: {
          example: {
            isLike: true,
            boardLikesCount: 2,
          },
        },
      },
    }),
    ApiResponse({
      status: 200,
      description:
        '좋아요 조회 성공. 토큰이 없거나, 해당 유저가 좋아요를 누르지 않은 경우',
      content: {
        JSON: {
          example: {
            isLike: true,
            boardLikesCount: 2,
          },
        },
      },
    }),
    ApiResponse({
      status: 404,
      description: '해당 보드 id가 존재하지 않는 경우',
      content: {
        JSON: {
          example: {
            isLike: true,
            boardLikesCount: 2,
          },
        },
      },
    }),
  );
}
