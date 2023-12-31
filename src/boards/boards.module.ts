import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BoardsController } from './controllers/Boards.controller';
import { BoardsService } from './services/Boards.service';
import { Board } from './entities/board.entity';
import { BoardImagesService } from './services/BoardImage.service';
import { S3Service } from 'src/common/s3/s3.service';
import { BoardImage } from './entities/board-image.entity';
import { BoardRepository } from './repository/boards.repository';
import { BoardImageRepository } from './repository/boardImage.repository';
import { BoardsLikeController } from './controllers/boards-like.controller';
import { BoardsLikeService } from './services/boards-like.service';
import { BoardsLikeRepository } from './repository/boards-like.repository';
import { TokenService } from 'src/auth/services/token.service';
import { TokenRepository } from 'src/auth/repositories/token.repository';
import { NoticeModule } from 'src/common/notice/notice.module';

@Module({
  imports: [TypeOrmModule.forFeature([Board, BoardImage]), NoticeModule],
  controllers: [BoardsController, BoardsLikeController],
  providers: [
    BoardsService,
    BoardsLikeService,
    BoardImagesService,
    S3Service,
    TokenService,
    BoardRepository,
    BoardsLikeRepository,
    BoardImageRepository,
    TokenRepository,
  ],
  exports: [BoardsLikeRepository],
})
@Module({})
export class BoardsModule {}
