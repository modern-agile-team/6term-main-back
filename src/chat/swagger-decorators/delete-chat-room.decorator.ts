import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

export function ApiDeleteChatRoom() {
  return applyDecorators(
    ApiOperation({
      summary: '채팅룸 삭제',
      description: 'Header - user-token, Param - room-id',
    }),
    ApiResponse({
      status: 200,
      description: '성공적으로 채팅방 삭제',
      content: {
        JSON: {
          example: {
            success: true,
            msg: '게시글 삭제 성공',
          },
        },
      },
    }),
    ApiResponse({
      status: 400,
      description: '유효성 검사 실패',
      content: {
        JSON: {
          example: {
            message: '올바른 ObjectId 형식이 아닙니다.',
            error: 'Bad Request',
            statusCode: 400,
          },
        },
      },
    }),
    ApiResponse({
      status: 404,
      description: '해당 채팅룸이 없습니다.',
      content: {
        JSON: {
          example: {
            message: '해당 채팅룸이 없습니다.',
            error: 'Not Found',
            statusCode: 404,
          },
        },
      },
    }),
    ApiResponse({
      status: 404,
      description: '해당 유저는 채팅방에 속해있지 않습니다.',
      content: {
        JSON: {
          example: {
            message: '해당 유저는 채팅방에 속해있지 않습니다.',
            error: 'Not Found',
            statusCode: 404,
          },
        },
      },
    }),
  );
}
