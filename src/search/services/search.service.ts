import { Injectable, NotFoundException } from '@nestjs/common';
import { BoardResponseDTO } from 'src/boards/dto/boards.response.dto';
import { BoardsLikeRepository } from 'src/boards/repository/boards-like.repository';
import { SearchRepository } from '../repositories/search.repository';

@Injectable()
export class SearchService {
  constructor(
    private searchRepository: SearchRepository,
    private boardLikesRepository: BoardsLikeRepository,
  ) {}
  async searchBoardsByHead(
    category: string,
    searchQuery: string,
    page: number,
    limit: number,
  ) {
    const take = limit;
    const skip = page <= 0 ? (page = 0) : (page - 1) * take;

    const [returnedBoards, total] =
      await this.searchRepository.searchBoardsByHead(
        category,
        searchQuery,
        skip,
        take,
      );

    const last_page = Math.ceil(total / take);

    const boardResponse: BoardResponseDTO[] = await Promise.all(
      returnedBoards.map(async (board) => {
        const like = await this.boardLikesRepository.getBoardLikesCount(
          board.id,
        );

        return {
          id: board.id,
          head: board.head,
          body: board.body.substring(0, 30),
          main_category: board.main_category,
          sub_category: board.sub_category,
          createAt: board.createAt,
          updateAt: board.updateAt,
          userId: {
            name: board.user[0].name,
            userImage: board.user[0].userImage ? board.user[0].userImage : [],
          },
          boardLike: like,
          boardImages: board.boardImages.map((image) => ({
            id: image.id,
            imageUrl: image.imageUrl,
          })),
        };
      }),
    );
    if (last_page >= page) {
      return {
        data: boardResponse,
        meta: {
          total,
          page: page <= 0 ? (page = 1) : page,
          last_page,
        },
      };
    } else {
      throw new NotFoundException('해당 페이지는 존재하지 않습니다');
    }
  }

  async searchBoardsByBody(
    category: string,
    searchQuery: string,
    page: number,
    limit: number,
  ) {
    const take = limit;
    const skip = page <= 0 ? (page = 0) : (page - 1) * take;

    const [returnedBoards, total] =
      await this.searchRepository.searchBoardsByBody(
        category,
        searchQuery,
        skip,
        take,
      );

    const last_page = Math.ceil(total / take);

    const boardResponse: BoardResponseDTO[] = await Promise.all(
      returnedBoards.map(async (board) => {
        const like = await this.boardLikesRepository.getBoardLikesCount(
          board.id,
        );

        return {
          id: board.id,
          head: board.head,
          body: board.body.substring(0, 30),
          main_category: board.main_category,
          sub_category: board.sub_category,
          createAt: board.createAt,
          updateAt: board.updateAt,
          userId: {
            name: board.user[0].name,
            userImage: board.user[0].userImage ? board.user[0].userImage : [],
          },
          boardLike: like,
          boardImages: board.boardImages.map((image) => ({
            id: image.id,
            imageUrl: image.imageUrl,
          })),
        };
      }),
    );
    if (last_page >= page) {
      return {
        data: boardResponse,
        meta: {
          total,
          page: page <= 0 ? (page = 1) : page,
          last_page,
        },
      };
    } else {
      throw new NotFoundException('해당 페이지는 존재하지 않습니다.');
    }
  }

  async searchBoardsByUserName(
    category: string,
    searchQuery: string,
    page: number,
    limit: number,
  ) {
    const take = limit;
    const skip = page <= 0 ? (page = 0) : (page - 1) * take;

    const [returnedBoards] = await this.searchRepository.searchBoardsByUserName(
      category,
      searchQuery,
      skip,
      take,
    );

    return [returnedBoards];

    // const last_page = Math.ceil(total / take);

    // const boardResponse: BoardResponseDTO[] = await Promise.all(
    //   returnedBoards.map(async (board) => {
    //     const like = await this.boardLikesRepository.getBoardLikesCount(
    //       board.id,
    //     );

    //     return {
    //       id: board.id,
    //       head: board.head,
    //       body: board.body.substring(0, 30),
    //       main_category: board.main_category,
    //       sub_category: board.sub_category,
    //       createAt: board.createAt,
    //       updateAt: board.updateAt,
    //       userId: {
    //         name: board.user[0].name,
    //         userImage: board.user[0].userImage ? board.user[0].userImage : [],
    //       },
    //       boardLike: like,
    //       boardImages: board.boardImages.map((image) => ({
    //         id: image.id,
    //         imageUrl: image.imageUrl,
    //       })),
    //     };
    //   }),
    // );
    // if (last_page >= page) {
    //   return {
    //     data: boardResponse,
    //     meta: {
    //       total,
    //       page: page <= 0 ? (page = 1) : page,
    //       last_page,
    //     },
    //   };
    // } else {
    //   throw new NotFoundException('해당 페이지는 존재하지 않습니다.');
    // }
  }

  async searchUsersByName(searchQuery: string) {
    return this.searchRepository.searchUsersByName(searchQuery);
  }
}
