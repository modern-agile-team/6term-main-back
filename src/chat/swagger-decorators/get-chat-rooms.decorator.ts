import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

export function ApiGetChatRooms() {
  return applyDecorators(
    ApiOperation({
      summary: '채팅룸 조회',
      description: 'Header - user-token',
    }),
    ApiResponse({
      status: 200,
      description: '성공적으로 채팅방 조회',
      content: {
        JSON: {
          example: [
            {
              _id: '650bde3798dd4c34439c30dc',
              host_id: 123,
              guest_id: 1234,
              deleted_at: null,
              createdAt: '2023-09-21T06:09:59.724Z',
              updatedAt: '2023-09-21T06:09:59.724Z',
              __v: 0,
            },
            {
              _id: '6526a517b537b028e04ad45b',
              host_id: 1234,
              guest_id: 12345,
              deleted_at: null,
              createdAt: '2023-10-11T13:37:28.013Z',
              updatedAt: '2023-10-11T13:37:28.013Z',
              __v: 0,
            },
          ],
        },
      },
    }),
    ApiResponse({
      status: 404,
      description: '채팅룸 조회 실패.',
      content: {
        JSON: {
          example: {
            message: '해당 유저가 속한 채팅방이 없습니다.',
            error: 'Not Found',
            statusCode: 404,
          },
        },
      },
    }),
  );
}