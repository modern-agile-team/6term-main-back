import { Injectable } from '@nestjs/common';
import { BoardRepository } from '../repository/boards.repository';
import { CreateBoardDto } from '../dto/create.board.dto';
import { Board } from '../entities/board.entity';
import { BoardResponseDTO } from '../dto/boards.response.dto';
import { error } from 'console';

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

  async findPagedBoards(
    page: number,
    limit: number,
  ): Promise<BoardResponseDTO[]> {
    const skip = (page - 1) * limit;
    const take = limit;
    const boards = await this.boardRepository.findPagedBoards(skip, take);
    return boards.map((board) => ({
      id: board.id,
      head: board.head,
      body: board.body.substring(0, 30),
      main_category: board.main_category,
      sub_category: board.sub_category,
      createAt: board.createAt,
      updateAt: board.updateAt,
      userId: {
        id: board.user.id,
        name: board.user.name,
        userImage: board.user.userImage ? board.user.userImage : [],
      },
      boardImages: board.boardImages.map((image) => ({
        id: image.id,
        imageUrl: image.imageUrl,
      })),
    }));
  }

  async findOneBoard(id: number): Promise<BoardResponseDTO | undefined> {
    const board = await this.boardRepository.findBoardById(id);
    if (board) {
      return {
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
          userImage: board.user.userImage ? board.user.userImage : [],
        },
        boardImages: board.boardImages.map((image) => ({
          id: image.id,
          imageUrl: image.imageUrl,
        })),
      };
    }

    return undefined;
  }

  async updateBoard(
    id: number,
    boardData: Partial<Board>,
  ): Promise<Board | undefined> {
    const existingBoard = await this.boardRepository.findBoardById(id);
    for (const key in boardData) {
      if (boardData.hasOwnProperty(key)) {
        existingBoard[key] = boardData[key];
      }
    }
    const updatedBoard = await this.boardRepository.updateBoard(
      id,
      existingBoard,
    );
    return updatedBoard;
  }

  async deleteBoard(boardId: number, userId: number): Promise<void> {
    const board = await this.boardRepository.findBoardById(boardId);
    if (board.userId !== userId) {
      throw new error('작성한 게시물이 아닙니다.');
    }
    if (!board) {
      throw new error('존재하지 않는 게시물입니다.');
    }
    await this.boardRepository.deleteBoard(board);
  }
}
