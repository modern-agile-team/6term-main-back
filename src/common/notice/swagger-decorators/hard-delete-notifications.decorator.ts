import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

export function ApiHardDeleteNotificatons() {
  return applyDecorators(
    ApiOperation({
      summary: '확인한지 1주일 지난 알람 로우 삭제',
      description: 'db상에서 아예 삭제됨.',
    }),
    ApiResponse({
      status: 200,
      description: '성공적으로 알람 삭제.(삭제된 알람 로우의 갯수를 가져옴)',
      content: {
        JSON: {
          example: {
            success: true,
            msg: '3개의 알람을 지웠습니다.',
          },
        },
      },
    }),
  );
}
