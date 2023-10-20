import { applyDecorators } from '@nestjs/common';
import { ApiHeaders, ApiOperation, ApiResponse } from '@nestjs/swagger';

export function ApiGetFriendsReqPending() {
  return applyDecorators(
    ApiOperation({
      summary: '친구 요청 목록 조회 API',
      description: '내가 보낸 친구 요청 목록을 조회합니다.',
    }),
    ApiResponse({
      status: 200,
      description:
        '성공적으로 친구 요청 목록을 조회한 경우 (배열 형태) , 내가 보낸 친구 요청이 없는 경우 빈 배열을 반환합니다.',
      content: {
        Array: {
          example: [
            {
              id: 1,
              requesterId: 63,
              respondentId: 57,
              status: '대기 상태',
            },
            {
              id: 3,
              requesterId: 63,
              respondentId: 62,
              status: '대기 상태',
            },
            {
              id: 4,
              requesterId: 63,
              respondentId: 64,
              status: '대기 상태',
            },
          ],
        },
      },
    }),
    ApiResponse({
      status: 401,
      description: '우리 서비스의 액세스 토큰이 아닌 경우',
      content: {
        JSON: {
          example: { statusCode: 401, message: '유효하지 않은 토큰입니다.' },
        },
      },
    }),
    ApiResponse({
      status: 403,
      description: '만료된 액세스 토큰인 경우',
      content: {
        JSON: {
          example: { statusCode: 403, message: '만료된 토큰입니다.' },
        },
      },
    }),
    ApiResponse({
      status: 404,
      description: 'DB에서 사용자를 찾을 수 없는 경우',
      content: {
        JSON: {
          example: { statusCode: 404, message: '사용자를 찾을 수 없습니다.' },
        },
      },
    }),
    ApiResponse({
      status: 411,
      description: '액세스 토큰이 제공되지 않은 경우',
      content: {
        JSON: {
          example: { statusCode: 411, message: '토큰이 제공되지 않았습니다.' },
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
