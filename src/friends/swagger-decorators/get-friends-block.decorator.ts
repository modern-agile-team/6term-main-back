import { applyDecorators } from '@nestjs/common';
import { ApiHeaders, ApiOperation, ApiResponse } from '@nestjs/swagger';

export function ApiGetFriendsBlock() {
  return applyDecorators(
    ApiOperation({
      summary: '내가 차단한 친구 목록 조회 API',
      description: '내가 차단한 친구 목록을 조회합니다.',
    }),
    ApiResponse({
      status: 200,
      description:
        '성공적으로 친구 목록을 조회한 경우 (배열 형태) , 내가 차단한 친구가 없는 경우 빈 배열을 반환합니다.',
      content: {
        Array: {
          example: [
            {
              id: 53,
              requesterId: 62,
              respondentId: 1,
              status: '차단',
              createdAt: '2023-11-15T21:13:13.000Z',
              requester: {
                name: '박준혁',
                userImage: {
                  imageUrl:
                    'http://k.kakaocdn.net/dn/bgfjbT/btrNZpdv3sK/AMb1oWdaF6WxMEXkuKRkR0/img_640x640.jpg',
                },
              },
              respondent: {
                name: 'test',
                userImage: {
                  imageUrl:
                    'http://k.kakaocdn.net/dn/dpk9l1/btqmGhA2lKL/Oz0wDuJn1YV2DIn92f6DVK/img_640x640.jpg',
                },
              },
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
