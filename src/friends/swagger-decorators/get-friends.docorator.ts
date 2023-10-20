import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

export function ApiGetFriends() {
  return applyDecorators(
    ApiOperation({
      summary: '친구 목록 조회 API',
      description: '내 친구 목록을 조회합니다.',
    }),
    ApiResponse({
      status: 200,
      description:
        '성공적으로 친구 목록을 조회한 경우 (배열 형태) , 친구가 없는 경우 빈 배열을 반환합니다.',
      content: {
        Array: {
          example: [
            {
              id: 3,
              requesterId: 63,
              respondentId: 62,
              status: '친구 수락',
            },
            {
              id: 4,
              requesterId: 63,
              respondentId: 64,
              status: '친구 수락',
            },
            {
              id: 18,
              requesterId: 63,
              respondentId: 1,
              status: '친구 수락',
            },
          ],
        },
      },
    }),
  );
}
