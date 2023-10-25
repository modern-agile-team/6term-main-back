import { applyDecorators } from "@nestjs/common";
import { ApiOperation, ApiResponse } from "@nestjs/swagger";

export function ApiGetUserInfo() {
  return applyDecorators(
    ApiOperation({
      summary: '유저 정보 조회 API',
      description: '유저 정보 조회 API',
    }),
    ApiResponse({
      status: 200,
      description: '성공적으로 유저 정보를 조회한 경우',
      content: {
        JSON: {
          example: {
            "userName": "이승우",
            "userImage": "http://k.kakaocdn.net/dn/dpk9l1/btqmGhA2lKL/Oz0wDuJn1YV2DIn92f6DVK/img_640x640.jpg"
          },
        },
      },
    }),
    ApiResponse({
      status: 404,
      description: '유저 정보를 찾을 수 없는 경우',
      content: {
        JSON: {
          example: {
            "statusCode": 404,
            "message": "사용자를 찾을 수 없습니다.",
            "error": "Not Found"
          },
        },
      },
    }),
  );
}