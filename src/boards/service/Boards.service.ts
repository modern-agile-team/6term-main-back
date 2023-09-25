import { Injectable } from '@nestjs/common';
import { BoardRepository } from '../repository/boards.repository';
import { CreateBoardDto } from '../dto/create.board.dto';
import { Board } from '../entities/board.entity';
// import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class BoardsService {
  constructor(private boardRepository: BoardRepository) {}

  async create(boardData: CreateBoardDto): Promise<Board> {
    console.log(11);
    try {
      return await this.boardRepository.createBoard(boardData);
    } catch (error) {
      console.log(error);
    }

    // return await this.boardRepository.createBoard(boardData); // 여기서 오류가 나는데 왜 나는지 이유를 모르겠음.
    // 전체적인 코드로직상 controller -> service -> repository인데 여기서 안됨.
  }

  async findAll(): Promise<Board[]> {
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
