import { applyDecorators } from '@nestjs/common';
import { ApiHeaders, ApiOperation, ApiResponse } from '@nestjs/swagger';

export function ApiGetFriendsResPending() {
  return applyDecorators(
    ApiOperation({
      summary: '내가 받은 친구 요청 목록 조회 API',
      description: '내가 받은 친구 요청 목록을 조회합니다.',
    }),
    ApiResponse({
      status: 200,
      description:
        '성공적으로 친구 요청 목록을 조회한 경우 (배열 형태) , 내가 받은 친구 요청이 없는 경우 빈 배열을 반환합니다.',
      content: {
        Array: {
          example: [
            {
              id: 25,
              requesterId: 65,
              respondentId: 62,
              status: '대기 상태',
              createdAt: '2023-11-06T23:37:41.000Z',
              requester: {
                name: '이승우',
                userImage: {
                  imageUrl:
                    'https://phinf.pstatic.net/contact/20200919_86/1600520194140Tp4Bo_JPEG/d.jpg',
                },
              },
            },
            {
              id: 26,
              requesterId: 70,
              respondentId: 62,
              status: '대기 상태',
              createdAt: '2023-11-06T23:38:11.000Z',
              requester: {
                name: 'zeratul',
                userImage: {
                  imageUrl:
                    'https://ssl.pstatic.net/static/pwe/address/img_profile.png',
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
