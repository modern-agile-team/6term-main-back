import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BoardsController } from './controller/Boards.controller';
import { BoardsService } from './service/Boards.service';
import { Board } from './entities/board.entity';
import { BoardImagesController } from './controller/BoardImage.controller';
import { BoardImagesService } from './service/BoardImage.service';
import { S3Service } from 'src/common/s3/s3.service';
import { BoardImage } from './entities/board-image.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Board, BoardImage])],
  // controller와 service가 모듈에 정의되어야 컨트롤러,서비스 안에서 이용가능합니다.
  controllers: [BoardsController, BoardImagesController],
  providers: [BoardsService, BoardImagesService, S3Service],
})
@Module({})
export class BoardsModule {}
