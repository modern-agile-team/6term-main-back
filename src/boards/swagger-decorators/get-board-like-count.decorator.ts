import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

export function ApiGetBoardLikeCount() {
  return applyDecorators(
    ApiOperation({
      summary: '해당 게시글 좋아요 개수 조회',
      description: 'Param - board-id',
    }),
    ApiResponse({
      status: 200,
      description:
        '좋아요 조회 성공. 실제 response 값은 count 없이 숫자만 들어옴.',
      content: {
        JSON: {
          example: {
            count: 1,
          },
        },
      },
    }),
  );
}
