import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

export function ApiGetPageBoards() {
  return applyDecorators(
    ApiOperation({
      summary: '페이지 별로 보드 가져오기',
      // description:
    }),
    ApiResponse({
      status: 200,
      description: '성공적으로 보드 가져옴',
      content: {
        JSON: {
          example: {
            success: true,
            msg: '페이지별로 보드를 가져왔습니다',
          },
        },
      },
    }),
    // ApiResponse({
    //   status: 404,
    //   description: '해당 유저가 존재하지 않는 경우',
    //   content: {
    //     JSON: {
    //       example: {
    //         success: false,
    //         code: 404,
    //         data: '해당 유저가 없습니다',
    //       },
    //     },
    //   },
    // }),
    // ApiResponse({
    //   status: 404,
    //   description: '해당 게시글이 존재하지 않는 경우',
    //   content: {
    //     JSON: {
    //       example: {
    //         success: false,
    //         code: 404,
    //         data: '해당 게시글이 없습니다.',
    //       },
    //     },
    //   },
    // }),
    // ApiResponse({
    //   status: 409,
    //   description: '해당 게시글의 좋아요가 이미 존재하는 경우',
    //   content: {
    //     JSON: {
    //       example: {
    //         success: false,
    //         code: 409,
    //         data: '이미 좋아요가 있습니다',
    //       },
    //     },
    //   },
    // }),
  );
}
