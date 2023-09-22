import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Board } from '../entities/board.entity';
import { User } from 'src/users/entities/user.entity';
import { CreateBoardDto } from '../dto/create.board.dto';

@Injectable()
export class BoardsService {
  constructor(
    @InjectRepository(Board)
    private boardRepository: Repository<Board>,
  ) {}

  async create(boardData: CreateBoardDto): Promise<Board> {
    const userId = 1; // 임시로 1 쓴거야 준혁아 이부분 너가 수정해야해

    const user = new User(); // User 엔터티의 인스턴스를 생성
    user.id = userId;

    const board = this.boardRepository.create({
      ...boardData,
      userId: user,
    });

    return await this.boardRepository.save(board);
  }

  async findAll(): Promise<Board[]> {
    return await this.boardRepository.find();
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
