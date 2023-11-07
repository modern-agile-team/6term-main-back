import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

export function ApiSearchBoardsByHead() {
  return applyDecorators(
    ApiOperation({
      summary: '게시글 검색 API',
      description: `Query String으로 입력된 값을 토대로 게시글의 제목에 일치하는 값을 조회합니다. 
      ex)'흑돼지고기' 검색 - '흑돼', '돼지', '지고', '고기'로 검색 (정확성 순으로 정렬됨)`,
    }),
    ApiResponse({
      status: 200,
      description: '성공적으로 검색한 게시글(제목 기준) 조회',
      content: {
        JSON: {
          example: {
            data: [
              {
                id: 286,
                head: '흑돼지고기',
                body: '바 보',
                main_category: '만남',
                sub_category: '친구',
                createAt: '2023-11-01T21:33:59.713Z',
                updateAt: '2023-11-01T21:33:59.713Z',
                userId: {
                  name: '이재진',
                  userImage: {
                    id: 16,
                    userId: 66,
                    imageUrl:
                      'http://k.kakaocdn.net/dn/prL5M/btsjYsDuxVB/zzswnuvKP610YUBwvRuSb1/img_640x640.jpg',
                  },
                },
                boardLike: 0,
                boardImages: [],
              },
              {
                id: 293,
                head: '흑돼지고기',
                body: '바 보',
                main_category: '만남',
                sub_category: '친구',
                createAt: '2023-11-01T21:34:25.623Z',
                updateAt: '2023-11-01T21:34:25.623Z',
                userId: {
                  name: '이재진',
                  userImage: {
                    id: 16,
                    userId: 66,
                    imageUrl:
                      'http://k.kakaocdn.net/dn/prL5M/btsjYsDuxVB/zzswnuvKP610YUBwvRuSb1/img_640x640.jpg',
                  },
                },
                boardLike: 0,
                boardImages: [],
              },
              {
                id: 292,
                head: '백돼지고기',
                body: '바 보',
                main_category: '만남',
                sub_category: '친구',
                createAt: '2023-11-01T21:34:21.670Z',
                updateAt: '2023-11-01T21:34:21.670Z',
                userId: {
                  name: '이재진',
                  userImage: {
                    id: 16,
                    userId: 66,
                    imageUrl:
                      'http://k.kakaocdn.net/dn/prL5M/btsjYsDuxVB/zzswnuvKP610YUBwvRuSb1/img_640x640.jpg',
                  },
                },
                boardLike: 0,
                boardImages: [],
              },
              {
                id: 287,
                head: '흑돼지 고기',
                body: '바 보',
                main_category: '만남',
                sub_category: '친구',
                createAt: '2023-11-01T21:34:01.707Z',
                updateAt: '2023-11-01T21:34:01.707Z',
                userId: {
                  name: '이재진',
                  userImage: {
                    id: 16,
                    userId: 66,
                    imageUrl:
                      'http://k.kakaocdn.net/dn/prL5M/btsjYsDuxVB/zzswnuvKP610YUBwvRuSb1/img_640x640.jpg',
                  },
                },
                boardLike: 0,
                boardImages: [],
              },
              {
                id: 294,
                head: '흑돼지 고기',
                body: '바 보',
                main_category: '만남',
                sub_category: '친구',
                createAt: '2023-11-01T21:34:32.500Z',
                updateAt: '2023-11-01T21:34:32.500Z',
                userId: {
                  name: '이재진',
                  userImage: {
                    id: 16,
                    userId: 66,
                    imageUrl:
                      'http://k.kakaocdn.net/dn/prL5M/btsjYsDuxVB/zzswnuvKP610YUBwvRuSb1/img_640x640.jpg',
                  },
                },
                boardLike: 0,
                boardImages: [],
              },
              {
                id: 289,
                head: '양 고기',
                body: '바 보',
                main_category: '만남',
                sub_category: '친구',
                createAt: '2023-11-01T21:34:10.379Z',
                updateAt: '2023-11-01T21:34:10.379Z',
                userId: {
                  name: '이재진',
                  userImage: {
                    id: 16,
                    userId: 66,
                    imageUrl:
                      'http://k.kakaocdn.net/dn/prL5M/btsjYsDuxVB/zzswnuvKP610YUBwvRuSb1/img_640x640.jpg',
                  },
                },
                boardLike: 0,
                boardImages: [],
              },
            ],
            total: 6,
          },
        },
      },
    }),
  );
}
