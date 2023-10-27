import { applyDecorators } from '@nestjs/common';
import { ApiHeaders, ApiOperation, ApiResponse } from '@nestjs/swagger';

export function ApiGetAllNotifications() {
  return applyDecorators(
    ApiOperation({
      summary: '알람 조회 API',
      description: '해당 유저의 모든 종류의 알람 조회(chat 제외)',
    }),
    ApiResponse({
      status: 200,
      description: '성공적으로 알람 조회',
      content: {
        JSON: {
          example: [
            {
              id: 1,
              boardId: 87,
              senderId: 66,
              receiverId: 1,
              separator: '좋아요',
              isSeen: false,
              createdAt: '2023-10-25T22:03:50.993Z',
              deletedAt: null,
            },
            {
              id: 2,
              boardId: 87,
              senderId: 66,
              receiverId: 1,
              separator: '대댓글',
              isSeen: true,
              createdAt: '2023-10-25T22:06:17.447Z',
              deletedAt: '2023-10-26T07:49:57.574Z',
            },
            {
              id: 4,
              boardId: 87,
              senderId: 66,
              receiverId: 1,
              separator: '댓글',
              isSeen: false,
              createdAt: '2023-10-25T22:10:54.494Z',
              deletedAt: null,
            },
          ],
        },
      },
    }),
    ApiResponse({
      status: 404,
      description: '알람 조회 실패.',
      content: {
        JSON: {
          example: {
            message: '해당 유저를 찾지 못했습니다.',
            error: 'Not Found',
            statusCode: 404,
          },
        },
      },
    }),
    ApiHeaders([
      {
        name: 'access_token',
        description: '액세스 토큰',
        required: true,
        example: '여기에 액세스 토큰',
      },
    ]),
  );
}
