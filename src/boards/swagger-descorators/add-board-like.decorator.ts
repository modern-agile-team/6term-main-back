import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

export function ApiAddBoardLike() {
  return applyDecorators(
    ApiOperation({
      summary: '좋아요 생성',
      description: 'Header - user-token, Param - board-id',
    }),
    ApiResponse({
      status: 201,
      description: '성공적으로 좋아요 생성',
      content: {
        JSON: {
          example: {
            boardId: {
              id: 87,
              userId: 1,
              head: 'test1',
              body: '<p>test1 2023.10.09 자유 잡담 게시판</p>',
              main_category: '자유',
              sub_category: '잡담',
              createAt: '2023-10-08T20:58:47.564Z',
              updateAt: '2023-10-08T20:58:47.564Z',
            },
            userId: {
              id: 1,
              provider: '',
              name: 'test',
              email: 'test@email.com',
              gender: 'M',
              admin: false,
            },
            id: 10,
            createAt: '2023-10-15T23:56:19.506Z',
          },
        },
      },
    }),
    ApiResponse({
      status: 404,
      description: '해당 유저가 존재하지 않는 경우',
      content: {
        JSON: {
          example: {
            success: false,
            code: 404,
            data: '해당 유저가 없습니다',
          },
        },
      },
    }),
    ApiResponse({
      status: 404,
      description: '해당 게시글이 존재하지 않는 경우',
      content: {
        JSON: {
          example: {
            success: false,
            code: 404,
            data: '해당 게시글이 없습니다.',
          },
        },
      },
    }),
    ApiResponse({
      status: 409,
      description: '해당 게시글의 좋아요가 이미 존재하는 경우',
      content: {
        JSON: {
          example: {
            success: false,
            code: 409,
            data: '이미 좋아요가 있습니다',
          },
        },
      },
    }),
  );
}
