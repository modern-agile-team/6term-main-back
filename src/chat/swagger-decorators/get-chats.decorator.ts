import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

export function ApiGetChats() {
  return applyDecorators(
    ApiOperation({
      summary: '해당 채팅룸 채팅 전체 조회',
      description: 'Param - room-id',
    }),
    ApiResponse({
      status: 200,
      description: '성공적으로 채팅방 채팅 조회',
      content: {
        JSON: {
          example: [
            {
              _id: '65338bc82d17fd935414495b',
              chatroom_id: '653383a4468680bc4e9f8491',
              sender: 12345642,
              receiver: 123456427,
              content: 'testtset',
              createdAt: '2023-10-21T08:28:56.916Z',
              updatedAt: '2023-10-21T08:28:56.916Z',
              __v: 0,
            },
            {
              _id: '65338bec2d17fd9354144961',
              chatroom_id: '653383a4468680bc4e9f8491',
              sender: 12345642,
              receiver: 123456427,
              content: 'testtset12',
              createdAt: '2023-10-21T08:29:32.578Z',
              updatedAt: '2023-10-21T08:29:32.578Z',
              __v: 0,
            },
            {
              _id: '65338bf12d17fd9354144967',
              chatroom_id: '653383a4468680bc4e9f8491',
              sender: 12345642,
              receiver: 123456427,
              content: 'testtset123',
              createdAt: '2023-10-21T08:29:37.481Z',
              updatedAt: '2023-10-21T08:29:37.481Z',
              __v: 0,
            },
          ],
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
      description: '채팅 조회 실패.',
      content: {
        JSON: {
          example: {
            message: '해당 채팅룸이 없거나 채팅이 존재하지 않습니다.',
            error: 'Not Found',
            statusCode: 404,
          },
        },
      },
    }),
  );
}
