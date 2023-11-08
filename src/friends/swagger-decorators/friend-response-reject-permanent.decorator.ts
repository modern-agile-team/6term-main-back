import { applyDecorators } from '@nestjs/common';
import { ApiHeaders, ApiOperation, ApiResponse } from '@nestjs/swagger';

export function ApiFriendResponseRejectPermanent() {
  return applyDecorators(
    ApiOperation({
      summary: '친구 요청 영구 거절 API',
      description: '친구 요청을 영구적으로 거절합니다.',
    }),
    ApiResponse({
      status: 200,
      description: '성공적으로 친구 요청을 영구적으로 거절한 경우',
      content: {
        JSON: { example: { message: '친구 요청을 영구적으로 거절했습니다.' } },
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
      description: '친구 요청을 찾을 수 없는 경우',
      content: {
        JSON: {
          example: {
            statusCode: 404,
            message: '친구 요청을 찾을 수 없습니다.',
          },
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
    ApiResponse({
      status: 500,
      description: '친구 요청 영구 거절에 실패한 경우',
      content: {
        JSON: {
          example: {
            statusCode: 500,
            message: '친구 요청 영구 거절에 실패했습니다.',
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
