import { Injectable } from '@nestjs/common';
import { BoardRepository } from '../repository/boards.repository';
import { CreateBoardDto } from '../dto/create.board.dto';
import { Board } from '../entities/board.entity';
import { BoardResponseDTO } from '../dto/boards.response.dto';

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

  async update(
    id: number,
    boardData: Partial<Board>,
  ): Promise<Board | undefined> {
    const existingBoard = await this.boardRepository.findBoardById(id);
    if (!existingBoard) {
      return undefined; // 게시물을 찾을 수 없는 경우 undefined 반환
    }
    if (boardData.head) {
      existingBoard.head = boardData.head;
    }
    if (boardData.body) {
      existingBoard.body = boardData.body;
    }
    if (boardData.main_category) {
      existingBoard.main_category = boardData.main_category;
    }
    if (boardData.sub_category) {
      existingBoard.sub_category = boardData.sub_category;
    }
    if (boardData.updateAt) {
      existingBoard.updateAt = boardData.updateAt;
    }
    const updatedBoard = await this.boardRepository.updateBoard(
      id,
      existingBoard,
    );
    return updatedBoard;
  }

  async deleteBoard(boardId: number, userId: number) {
    try {
      return await this.boardRepository.deleteBoard(boardId, userId);
    } catch (error) {
      console.error('좋아요 취소 실패: ', error);
      throw error;
    }
  }

  // async deleteBoard(id: number): Promise<void> {
  //   await this.boardRepository.deleteBoard(id);
  // }
}
