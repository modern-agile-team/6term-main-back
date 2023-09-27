import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BoardsController } from './controllers/Boards.controller';
import { BoardsService } from './services/Boards.service';
import { Board } from './entities/board.entity';
import { BoardImagesController } from './controllers/BoardImage.controller';
import { BoardImagesService } from './services/BoardImage.service';
import { S3Service } from 'src/common/s3/s3.service';
import { BoardImage } from './entities/board-image.entity';
import { BoardRepository } from './repository/boards.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Board, BoardImage])],
  // controller와 service가 모듈에 정의되어야 컨트롤러,서비스 안에서 이용가능합니다.
  controllers: [BoardsController, BoardImagesController],
  providers: [BoardsService, BoardImagesService, S3Service, BoardRepository],
})
@Module({})
export class BoardsModule {}
