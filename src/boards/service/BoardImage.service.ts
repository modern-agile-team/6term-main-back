import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BoardImage } from '../entities/board-image.entity';
import { Board } from '../entities/board.entity'; // Board 엔터티 가져오기
// import { S3Service } from '../../common/s3/s3.service';

@Injectable()
export class BoardImagesService {
  constructor(
    @InjectRepository(BoardImage)
    private boardImagesRepository: Repository<BoardImage>,
  ) {}

  async create(boardId: number): Promise<BoardImage> {
    const boardImage = new BoardImage();
    const board = new Board(); // Board 인스턴스를 가져와서 사용
    board.id = boardId; // boardId를 number로 설정
    boardImage.boardId = board;
    return this.boardImagesRepository.save(boardImage);
  }

  async findByBoardId(boardId: number): Promise<BoardImage[]> {
    return this.boardImagesRepository.find({
      where: { boardId: { id: boardId } },
    });
  }
}
