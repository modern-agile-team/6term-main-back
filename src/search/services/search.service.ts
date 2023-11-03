import { Injectable } from '@nestjs/common';
import { BoardResponseDTO } from 'src/boards/dto/boards.response.dto';
import { BoardsLikeRepository } from 'src/boards/repository/boards-like.repository';
import { SearchRepository } from '../repositories/search.repository';

@Injectable()
export class SearchService {
  constructor(
    private searchRepository: SearchRepository,
    private boardLikesRepository: BoardsLikeRepository,
  ) {}
  async searchBoardsByHeadOrBody(searchQuery: string) {
    const returnedBoards =
      await this.searchRepository.searchBoardsByHeadOrBody(searchQuery);

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
            name: board.user.name,
            userImage: board.user.userImage ? board.user.userImage : [],
          },
          boardLike: like,
          boardImages: board.boardImages.map((image) => ({
            id: image.id,
            imageUrl: image.imageUrl,
          })),
        };
      }),
    );

    return { data: boardResponse, total: boardResponse.length };
  }

  async searchUsersByName(searchQuery: string) {
    return this.searchRepository.searchUsersByName(searchQuery);
  }
}
