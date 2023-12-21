import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

export function ApiGetInfo() {
  return applyDecorators(
    ApiOperation({
      summary: '유저 id로 보드를 조회 API',
      description: '유저 id로 보드를 조회 API',
    }),
    ApiResponse({
      status: 200,
      description: '성공적으로 유저 id로 보드를 조회한 경우',
      content: {
        JSON: {
          example: {
            userId: 1,
            name: '홍길동',
            email: 'abcd@naver.com',
            gender: 'M',
            admin: false,
            provider: 'kakao',
            userImage: 'http://img.jpg',
          },
        },
      },
    }),
    ApiResponse({
      status: 404,
      description: '사용자를 찾을 수 없는 경우',
      content: {
        JSON: {
          example: {
            statusCode: 404,
            message: '사용자를 찾을 수 없습니다.',
            error: 'Not Found',
          },
        },
      },
    }),
  );
}
