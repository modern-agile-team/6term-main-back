import { Injectable } from '@nestjs/common';
import { BoardImage } from 'src/boards/entities/board-image.entity';
import { Board } from 'src/boards/entities/board.entity';
import { User } from 'src/users/entities/user.entity';
import { EntityManager } from 'typeorm';

@Injectable()
export class SearchRepository {
  constructor(private entityManager: EntityManager) {}
  async searchBoardsByHead(
    category: string,
    searchQuery: string,
    skip: number,
    take: number,
  ) {
    const boardRepository = this.entityManager.getRepository(Board);

    if (category === '전체') {
      return boardRepository
        .createQueryBuilder('board')
        .where(`MATCH(head) AGAINST (:searchQuery IN BOOLEAN MODE)`, {
          searchQuery,
        })
        .leftJoinAndMapMany(
          'board.user',
          User,
          'user',
          'user.id = board.userId',
        )
        .leftJoinAndSelect('user.userImage', 'userImage')
        .leftJoinAndMapMany(
          'board.boardImages',
          BoardImage,
          'boardImages',
          'boardImages.boardId = board.id',
        )
        .select([
          'board.id',
          'board.head',
          'board.body',
          'board.main_category',
          'board.sub_category',
          'board.createAt',
          'board.updateAt',
          'user.name',
          'userImage.id',
          'userImage.userId',
          'userImage.imageUrl',
          'boardImages.id',
          'boardImages.imageUrl',
        ])
        .skip(skip)
        .take(take)
        .getManyAndCount();
    }
    return boardRepository
      .createQueryBuilder('board')
      .where(`MATCH(head) AGAINST (:searchQuery IN BOOLEAN MODE)`, {
        searchQuery,
      })
      .andWhere('board.main_category = :category', { category })
      .leftJoinAndMapMany('board.user', User, 'user', 'user.id = board.userId')
      .leftJoinAndSelect('user.userImage', 'userImage')
      .leftJoinAndMapMany(
        'board.boardImages',
        BoardImage,
        'boardImages',
        'boardImages.boardId = board.id',
      )
      .select([
        'board.id',
        'board.head',
        'board.body',
        'board.main_category',
        'board.sub_category',
        'board.createAt',
        'board.updateAt',
        'user.name',
        'userImage.id',
        'userImage.userId',
        'userImage.imageUrl',
        'boardImages.id',
        'boardImages.imageUrl',
      ])
      .skip(skip)
      .take(take)
      .getManyAndCount();
  }

  async searchBoardsByBody(
    category: string,
    searchQuery: string,
    skip: number,
    take: number,
  ) {
    const boardRepository = this.entityManager.getRepository(Board);

    if (category === '전체') {
      return boardRepository
        .createQueryBuilder('board')
        .where(`MATCH(body) AGAINST (:searchQuery IN BOOLEAN MODE)`, {
          searchQuery,
        })
        .leftJoinAndMapMany(
          'board.user',
          User,
          'user',
          'user.id = board.userId',
        )
        .leftJoinAndSelect('user.userImage', 'userImage')
        .leftJoinAndMapMany(
          'board.boardImages',
          BoardImage,
          'boardImages',
          'boardImages.boardId = board.id',
        )
        .select([
          'board.id',
          'board.head',
          'board.body',
          'board.main_category',
          'board.sub_category',
          'board.createAt',
          'board.updateAt',
          'user.name',
          'userImage.id',
          'userImage.userId',
          'userImage.imageUrl',
          'boardImages.id',
          'boardImages.imageUrl',
        ])
        .skip(skip)
        .take(take)
        .getManyAndCount();
    }
    return boardRepository
      .createQueryBuilder('board')
      .where(`MATCH(body) AGAINST (:searchQuery IN BOOLEAN MODE)`, {
        searchQuery,
      })
      .andWhere('board.main_category = :category', { category })
      .leftJoinAndMapMany('board.user', User, 'user', 'user.id = board.userId')
      .leftJoinAndSelect('user.userImage', 'userImage')
      .leftJoinAndMapMany(
        'board.boardImages',
        BoardImage,
        'boardImages',
        'boardImages.boardId = board.id',
      )
      .select([
        'board.id',
        'board.head',
        'board.body',
        'board.main_category',
        'board.sub_category',
        'board.createAt',
        'board.updateAt',
        'user.name',
        'userImage.id',
        'userImage.userId',
        'userImage.imageUrl',
        'boardImages.id',
        'boardImages.imageUrl',
      ])
      .skip(skip)
      .take(take)
      .getManyAndCount();
  }

  async searchBoardsByUserName(
    category: string,
    searchQuery: string,
    skip: number,
    take: number,
  ) {
    const userRepository = this.entityManager.getRepository(User);

    if (category === '전체') {
      const returnedUsers = await userRepository
        .createQueryBuilder('user')
        .where(`MATCH(name) AGAINST (:searchQuery IN BOOLEAN MODE)`, {
          searchQuery,
        })
        .select(['user.id'])
        .getMany();
      console.log(returnedUsers);
      returnedUsers.forEach((id) => {
        this.entityManager.findOne(Board, { where: { userId: id } });
      });

      return [returnedUsers];
    }
    // return userRepository
    //   .createQueryBuilder('board')
    //   .where(`MATCH(body) AGAINST (:searchQuery IN BOOLEAN MODE)`, {
    //     searchQuery,
    //   })
    //   .andWhere('board.main_category = :category', { category })
    //   .leftJoinAndMapMany('board.user', User, 'user', 'user.id = board.userId')
    //   .leftJoinAndSelect('user.userImage', 'userImage')
    //   .leftJoinAndMapMany(
    //     'board.boardImages',
    //     BoardImage,
    //     'boardImages',
    //     'boardImages.boardId = board.id',
    //   )
    //   .select([
    //     'board.id',
    //     'board.head',
    //     'board.body',
    //     'board.main_category',
    //     'board.sub_category',
    //     'board.createAt',
    //     'board.updateAt',
    //     'user.name',
    //     'userImage.id',
    //     'userImage.userId',
    //     'userImage.imageUrl',
    //     'boardImages.id',
    //     'boardImages.imageUrl',
    //   ])
    //   .skip(skip)
    //   .take(take)
    //   .getManyAndCount();
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
