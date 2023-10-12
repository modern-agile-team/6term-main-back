import { EntityManager } from 'typeorm';
import { Board } from '../entities/board.entity';
import { CreateBoardDto } from '../dto/create.board.dto';
import { User } from 'src/users/entities/user.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class BoardRepository {
  constructor(private readonly entityManager: EntityManager) {}

  async createBoard(boardData: CreateBoardDto): Promise<Board> {
    const userId = 1; // 임시로 1 쓴거야, 준혁아 여기 수정하면 된다.

    const user = new User();
    user.id = userId;

    const board = new Board();
    board.head = boardData.head;
    board.body = boardData.body;
    board.main_category = boardData.main_category;
    board.sub_category = boardData.sub_category;
    board.userId = userId;

    return await this.entityManager.save(Board, board);
  }

  async findAllBoards(): Promise<Board[]> {
    return await this.entityManager.find(Board, {
      relations: ['user', 'user.userImage', 'boardImages'],
    });
  }

  async findPagedBoards(page: number, limit: number): Promise<Board[]> {
    const skip = (page - 1) * limit;
    return await this.entityManager.find(Board, {
      relations: ['user', 'user.userImage', 'boardImages'],
      take: limit,
      skip: skip,
    });
  }

  async findBoardById(id: number): Promise<Board | undefined> {
    return await this.entityManager.findOne(Board, { where: { id } });
  }

  async updateBoard(
    id: number,
    boardData: Partial<Board>,
  ): Promise<Board | undefined> {
    await this.entityManager.update(Board, id, boardData);
    return await this.findBoardById(id);
  }

  async deleteBoard(id: number): Promise<void> {
    await this.entityManager.delete(Board, id);
  }
}
