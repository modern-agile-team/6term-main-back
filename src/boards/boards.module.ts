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

@Module({
  imports: [TypeOrmModule.forFeature([Board, BoardImage])],
  controllers: [BoardsController],
  providers: [
    BoardsService,
    BoardImagesService,
    S3Service,
    BoardRepository,
    BoardImageRepository,
  ],
})
@Module({})
export class BoardsModule {}
