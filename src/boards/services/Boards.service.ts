import { Injectable } from '@nestjs/common';
import { BoardRepository } from '../repository/boards.repository';
import { CreateBoardDto } from '../dto/create.board.dto';
import { Board } from '../entities/board.entity';
import { BoardResponseDTO } from '../dto/boards.response.dto';
import { BoardsLikeRepository } from '../repository/boards-like.repository';

@Injectable()
export class BoardsService {
  constructor(
    private boardRepository: BoardRepository,
    private readonly boardLikeRepository: BoardsLikeRepository,
  ) {}
  async create(boardData: CreateBoardDto, userId: number): Promise<Board> {
    try {
      return await this.boardRepository.createBoard(boardData, userId);
    } catch (error) {
      console.log(error);
    }
  }

  async findPagedBoards(
    page: number,
    limit: number,
  ): Promise<{ data: BoardResponseDTO[]; total: number }> {
    const skip = (page - 1) * limit;
    const take = limit;
    const boards = await this.boardRepository.findPagedBoards(skip, take);
    const total = await this.boardRepository.findTotalBoards();

    const boardResponse: BoardResponseDTO[] = await Promise.all(
      boards.map(async (board) => {
        const like = await this.boardLikeRepository.getBoardLikesCount(
          board.id,
        );

        return {
          id: board.id,
          head: board.head,
          body: board.body.substring(0, 30),
          main_category: board.main_category,
          sub_category: board.sub_category,
          createAt: board.createAt,
          updateAt: board.updateAt,
          userId: {
            // id: board.user.id, (일단 주석처리 했습니다 이걸 없앨지 userImage에서의 userId를 없앨지)
            name: board.user.name,
            userImage: board.user.userImage ? board.user.userImage : [],
          },
          boardLike: like,
          boardImages: board.boardImages.map((image) => ({
            id: image.id,
            imageUrl: image.imageUrl,
          })),
        };
      }),
    );

    return { data: boardResponse, total };
  }

  async findOneBoard(boardId: number): Promise<BoardResponseDTO> {
    const board = await this.boardRepository.findBoardById(boardId);
    if (!board) {
      throw new Error('게시물을 찾을 수 없습니다.');
    }
    return {
      id: board.id,
      head: board.head,
      body: board.body,
      main_category: board.main_category,
      sub_category: board.sub_category,
      createAt: board.createAt,
      updateAt: board.updateAt,
      userId: {
        // id: board.user.id,
        name: board.user.name,
        userImage: board.user.userImage ? board.user.userImage : [],
      },
      boardImages: board.boardImages.map((image) => ({
        id: image.id,
        imageUrl: image.imageUrl,
      })),
    };
  }

  async updateBoard(
    boardId: number,
    boardData: Partial<Board>,
  ): Promise<Board | undefined> {
    const existingBoard = await this.boardRepository.findBoardById(boardId);
    for (const key in boardData) {
      if (boardData.hasOwnProperty(key)) {
        existingBoard[key] = boardData[key];
      }
    }
    const updatedBoard = await this.boardRepository.updateBoard(
      boardId,
      existingBoard,
    );
    return updatedBoard;
  }

  async deleteBoard(boardId: number, userId: number): Promise<void> {
    const board = await this.boardRepository.findBoardById(boardId);

    if (!board) {
      throw new Error('존재하지 않는 게시물입니다.');
    }

    if (board.userId !== userId) {
      throw new Error('작성한 게시물이 아닙니다.');
    }

    await this.boardRepository.deleteBoard(board);
  }
}
