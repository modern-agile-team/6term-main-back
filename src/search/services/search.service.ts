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
  async searchBoardsByHeadOrBodyOrUserName(
    head: string,
    body: string,
    userName: string,
    category: string,
    page: number,
    limit: number,
  ) {
    const take = limit;
    const skip = page <= 0 ? (page = 0) : (page - 1) * take;

    if (head) {
      const [returnedBoards, total] =
        await this.searchRepository.searchBoardsByHead(
          category,
          head,
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
          boardResponse,
          meta: {
            total,
            page: page <= 0 ? (page = 1) : page,
            last_page,
          },
        };
      } else {
        throw new NotFoundException('해당 페이지는 존재하지 않습니다');
      }
    } else if (body) {
      const [returnedBoards, total] =
        await this.searchRepository.searchBoardsByBody(
          category,
          body,
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
          boardResponse,
          meta: {
            total,
            page: page <= 0 ? (page = 1) : page,
            last_page,
          },
        };
      } else {
        throw new NotFoundException('해당 페이지는 존재하지 않습니다');
      }
    } else if (userName) {
      const returnedUsers = await this.searchRepository.findUserId(userName);
      if (!returnedUsers.length) return returnedUsers;

      const take = limit;
      const skip = page <= 0 ? (page = 0) : (page - 1) * take;
      const [returnedBoards, total] =
        await this.searchRepository.searchBoardsByUserName(
          category,
          returnedUsers,
          skip,
          take,
        );

      if (returnedBoards.length) {
        return returnedBoards;
      }

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
          boardResponse,
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
  }

  async searchBoardsByHead(
    category: string,
    serachQuery: string,
    page: number,
    limit: number,
  ) {
    const take = limit;
    const skip = page <= 0 ? (page = 0) : (page - 1) * take;
    const [returnedBoards, total] =
      await this.searchRepository.searchBoardsByHead(
        category,
        serachQuery,
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
        boardResponse,
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
    serachQuery: string,
    page: number,
    limit: number,
  ) {
    const take = limit;
    const skip = page <= 0 ? (page = 0) : (page - 1) * take;
    const [returnedBoards, total] =
      await this.searchRepository.searchBoardsByBody(
        category,
        serachQuery,
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
        boardResponse,
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

  async searchBoardsByUserName(
    category: string,
    serachQuery: string,
    page: number,
    limit: number,
  ) {
    const returnedUsers = await this.searchRepository.findUserId(serachQuery);
    if (!returnedUsers) return [];

    const take = limit;
    const skip = page <= 0 ? (page = 0) : (page - 1) * take;
    const [returnedBoards, total] =
      await this.searchRepository.searchBoardsByUserName(
        category,
        returnedUsers,
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
        boardResponse,
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

  async searchUsersByName(searchQuery: string) {
    return this.searchRepository.searchUsersByName(searchQuery);
  }
}
