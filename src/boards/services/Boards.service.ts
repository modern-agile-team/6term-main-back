import { Injectable } from '@nestjs/common';
import { BoardRepository } from '../repository/boards.repository';
import { CreateBoardDto } from '../dto/create.board.dto';
import { Board } from '../entities/board.entity';
// import { getConnection } from 'typeorm';

@Injectable()
export class BoardsService {
  constructor(private boardRepository: BoardRepository) {}

  async create(boardData: CreateBoardDto): Promise<Board> {
    try {
      return await this.boardRepository.createBoard(boardData);
    } catch (error) {
      console.log(error);
    }
  }

  async findAll(): Promise<Board[]> {
    // const queryBuilder = getConnection(), createQueryBuilder( Board, 'board')

    return await this.boardRepository.findAllBoards();
  }

  async findOne(id: number): Promise<Board | undefined> {
    return await this.boardRepository.findBoardById(id);
  }

  async update(
    id: number,
    boardData: Partial<Board>,
  ): Promise<Board | undefined> {
    return await this.boardRepository.updateBoard(id, boardData);
  }

  async remove(id: number): Promise<void> {
    await this.boardRepository.deleteBoard(id);
  }
}
