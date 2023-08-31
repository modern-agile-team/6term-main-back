import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeORMconfig } from './config/typeorm.config';
import { Image } from './uploads/entity/image.entity';

import { Test1Controller } from './test1/test1.controller';
import { Test1Service } from './test1/test1.service';
import { Test1Module } from './test1/test1.module';
import { UploadsController } from './uploads/uploads.controller';
import { UploadsService } from './uploads/uploads.service';
import { UploadsModule } from './uploads/uploads.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      ...TypeORMconfig, // TypeORM 설정 객체 확장
      entities: [Image], // Image 엔티티 추가
    }),
    TypeOrmModule.forFeature([Image]),
    Test1Module,
    UploadsModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env', // .env 파일 경로 설정
    }),
    MongooseModule.forRoot(process.env.DB_URI),
  ],
  controllers: [Test1Controller, UploadsController],
  providers: [Test1Service, UploadsService],
})
export class AppModule {}
