import { Injectable } from '@nestjs/common';
import { BoardResponseDTO } from 'src/boards/dto/boards.response.dto';
import { Board } from 'src/boards/entities/board.entity';
import { BoardsLikeRepository } from 'src/boards/repository/boards-like.repository';
import { User } from 'src/users/entities/user.entity';
import { EntityManager } from 'typeorm';

@Injectable()
export class SearchService {
  constructor(
    private entityManager: EntityManager,
    private boardLikesRepository: BoardsLikeRepository,
  ) {}
  async searchBoardsByHeadOrBody(searchQuery: string) {
    const boardRepository = this.entityManager.getRepository(Board);

    const returnedBoards = await boardRepository
      .createQueryBuilder('board')
      .select()
      .leftJoinAndSelect('board.user', 'user')
      .leftJoinAndSelect('user.userImage', 'userImage')
      .leftJoinAndSelect('board.boardImages', 'boardImages')
      .where(`MATCH(head) AGAINST (:searchQuery)`, {
        searchQuery,
      })
      .orWhere(`MATCH(body) AGAINST (:searchQuery)`, {
        searchQuery: `${searchQuery}`,
      })
      .getMany();
    console.log(returnedBoards);

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
    const userRepository = this.entityManager.getRepository(User);

    return userRepository
      .createQueryBuilder()
      .select()
      .where(`MATCH(name) AGAINST (:searchQuery)`, {
        searchQuery,
      })
      .getMany();
  }
}
