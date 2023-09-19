import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Board } from '../entities/board.entity'; // Board 엔터티 가져오기

@Injectable()
export class BoardsService {
  constructor(
    @InjectRepository(Board)
    private boardRepository: Repository<Board>,
  ) {}

  async create(boardData: Partial<Board>): Promise<Board> {
    const board = this.boardRepository.create(boardData);
    return this.boardRepository.save(board);
  }

  async findAll(): Promise<Board[]> {
    return this.boardRepository.find();
  }

  async findOne(id: number): Promise<Board | undefined> {
    return await this.boardRepository.findOne({ where: { id } }); // 버전을 다운시키던가 아니면 이대로 써야함
    // 원래코드 : return await this.boardRepository.findOne(id);
  }

  async update(
    id: number,
    boardData: Partial<Board>,
  ): Promise<Board | undefined> {
    await this.boardRepository.update(id, boardData);
    return await this.boardRepository.findOne({ where: { id } });
    //  원래코드 : return await this.boardRepository.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.boardRepository.delete(id);
  }
}
