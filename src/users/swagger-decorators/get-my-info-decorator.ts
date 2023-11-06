import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

export function ApiGetMyInfo() {
  return applyDecorators(
    ApiOperation({
      summary: '내 정보 조회 API',
      description: '내 정보 조회 API',
    }),
    ApiResponse({
      status: 200,
      description: '성공적으로 내 정보를 조회한 경우',
      content: {
        JSON: {
          example: {
            name: '박준혁',
            email: 'pjh_2004@naver.com',
            gender: 'M',
            admin: false,
            provider: 'kakao',
            userImage:
              'http://k.kakaocdn.net/dn/bgfjbT/btrNZpdv3sK/AMb1oWdaF6WxMEXkuKRkR0/img_640x640.jpg',
          },
        },
      },
    }),
    ApiResponse({
      status: 404,
      description: '내 정보를 찾을 수 없는 경우',
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
