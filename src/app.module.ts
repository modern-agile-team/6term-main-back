import { CommentModule } from './comments/comment.module';
import { UserModule } from './users/user.module';
import { Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeORMconfig } from './config/typeorm.config';
import { Test1Controller } from './test1/test1.controller';
import { Test1Service } from './test1/test1.service';
import { Test1Module } from './test1/test1.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatModule } from './chat/chat.module';
import { S3Module } from './common/s3/s3.module';
import { S3Service } from './common/s3/s3.service';
import { BoardsModule } from './boards/boards.module';
import { FriendModule } from './friend/friend.module';
import { NoticeModule } from './notice/notice.module';

import * as mongoose from 'mongoose';
import { GoogleStrategy } from './common/auth/google.strategy';
import { NaverStrategy } from './common/auth/naver.strategy';
import { AuthService } from './auth/auth.service';
import { AuthController } from './auth/auth.controller';
import { KakaoStrategy } from './common/auth/kakao.strategy';
import { UserRepository } from './users/repository/user.repository';

@Module({
  imports: [
    CommentModule,
    UserModule,
    TypeOrmModule.forRoot({
      ...TypeORMconfig, // TypeORM 설정 객체 확장
      synchronize: false, // DB 동기화 여부 설정
      // entities: [Image], // Image 엔티티 추가
    }),
    // TypeOrmModule.forFeature([Image]),
    Test1Module,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env', // .env 파일 경로 설정
    }),
    MongooseModule.forRoot(process.env.DB_URI),
    ChatModule,
    S3Module,
    BoardsModule,
    FriendModule,
    NoticeModule,
  ],
  controllers: [AuthController, Test1Controller],
  providers: [AuthService, UserRepository, GoogleStrategy, NaverStrategy, KakaoStrategy, Test1Service, S3Service],
})
export class AppModule implements NestModule {
  private readonly isDev: boolean =
    process.env.NODE_ENV === 'dev' ? true : false;
  configure() {
    mongoose.set('debug', this.isDev);
  }
}
