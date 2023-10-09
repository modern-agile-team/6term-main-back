import { Injectable } from '@nestjs/common';
import { BoardRepository } from '../repository/boards.repository';
import { CreateBoardDto } from '../dto/create.board.dto';
import { Board } from '../entities/board.entity';
import { BoardResponseDTO } from '../dto/board.response.dto';

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

  async findAll(): Promise<BoardResponseDTO[]> {
    const boards = await this.boardRepository.findAllBoards();
    return boards.map((board) => ({
      id: board.id,
      head: board.head,
      body: board.body,
      main_category: board.main_category,
      sub_category: board.sub_category,
      createAt: board.createAt,
      updateAt: board.updateAt,
      userId: {
        id: board.user.id,
        name: board.user.name,
        userImage: {
          id: board.user.userImage.id,
          imageUrl: board.user.userImage.imageUrl,
        },
      },
      boardImages: board.boardImages.map((image) => ({
        id: image.id,
        imageUrl: image.imageUrl,
      })),
    }));
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
