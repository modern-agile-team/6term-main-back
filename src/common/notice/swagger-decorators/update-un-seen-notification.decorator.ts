import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

export function ApiUpdateUnSeenNotification() {
  return applyDecorators(
    ApiOperation({
      summary: '확인한 알람 상태 업데이트 API',
      description:
        'isSeen이 true로 변경되고, deleted_at값이 현 시간으로 수정됨.',
    }),
    ApiResponse({
      status: 200,
      description: '성공적으로 알람 상태 업데이트',
      content: {
        JSON: {
          example: { success: true, msg: '업데이트 성공' },
        },
      },
    }),
    ApiResponse({
      status: 500,
      description: '상태 업데이트 실패.',
      content: {
        JSON: {
          example: {
            statusCode: 500,
            message: '데이터베이스 오류로 업데이트 실패.',
          },
        },
      },
    }),
  );
}
