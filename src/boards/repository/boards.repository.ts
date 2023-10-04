import { Repository } from 'typeorm';
import { Board } from '../entities/board.entity';
import { CreateBoardDto } from '../dto/create.board.dto';
import { User } from 'src/users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';

export class BoardRepository {
  constructor(
    @InjectRepository(Board)
    private readonly boardRepository: Repository<Board>,
  ) {}
  async createBoard(boardData: CreateBoardDto): Promise<Board> {
    const userId = 1; // 임시로 1 쓴거야, 준혁아 여기 수정하면 된다.
    const user = new User();
    user.id = userId;

    const board = this.boardRepository.create({
      ...boardData,
      userId: user,
    });

    return await this.boardRepository.save(board);
  }

  async findAllBoards(): Promise<Board[]> {
    return await this.boardRepository.find();
  }

  async findBoardById(id: number): Promise<Board | undefined> {
    return await this.boardRepository.findOne({ where: { id } }); // 버전을 다운시키던가 아니면 이대로 써야함
    // 원래코드 : return await this.findOne(id);
  }

  async updateBoard(
    id: number,
    boardData: Partial<Board>,
  ): Promise<Board | undefined> {
    await this.boardRepository.update(id, boardData);
    return await this.boardRepository.findOne({ where: { id } });
    //  원래코드 : return await this.boardRepository.findOne(id);
  }

  async deleteBoard(id: number): Promise<void> {
    await this.boardRepository.delete(id);
  }
}
