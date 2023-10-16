import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

export function ApiDeleteBoardLike() {
  return applyDecorators(
    ApiOperation({
      summary: '해당 게시글 좋아요 삭제',
      description: 'Header - user-token, Param - board-id',
    }),
    ApiResponse({
      status: 200,
      description: '성공적으로 좋아요 삭제.',
      content: {
        JSON: {
          example: {
            success: true,
            msg: '좋아요 삭제 성공',
          },
        },
      },
    }),
    ApiResponse({
      status: 404,
      description: '해당 게시글의 좋아요가 존재하지 않는 경우',
      content: {
        JSON: {
          example: {
            success: false,
            code: 404,
            data: '이미 좋아요가 없습니다.',
          },
        },
      },
    }),
  );
}
