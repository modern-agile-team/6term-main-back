import { TokenService } from './auth/services/token.service';
import { UserImageService } from './users/services/user-image.service';
import { AuthModule } from './auth/auth.module';
import { CommentModule } from './comments/comment.module';
import { UserModule } from './users/user.module';
import { Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeORMconfig } from './config/typeorm.config';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatModule } from './chat/chat.module';
import { S3Module } from './common/s3/s3.module';
import { S3Service } from './common/s3/s3.service';
import { BoardsModule } from './boards/boards.module';
import { FriendsModule } from './friends/friends.module';
import { NoticeModule } from './notice/notice.module';
import { EventsGateway } from './events/events.gateway';
import { EventsModule } from './events/events.module';
import * as mongoose from 'mongoose';
import { UserImageRepository } from './users/repositories/user-image.repository';
import { TokenRepository } from './auth/repositories/token.repository';

@Module({
  imports: [
    AuthModule,
    CommentModule,
    UserModule,
    TypeOrmModule.forRoot({
      ...TypeORMconfig, // TypeORM 설정 객체 확장
      synchronize: true, // DB 동기화 여부 설정
    }),
    // TypeOrmModule.forFeature([Image]),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env', // .env 파일 경로 설정
    }),
    MongooseModule.forRoot(process.env.DB_URI),
    ChatModule,
    S3Module,
    BoardsModule,
    FriendsModule,
    NoticeModule,
    EventsModule,
  ], //
  providers: [
    TokenService,
    TokenRepository,
    UserImageService,
    UserImageRepository,
    S3Service,
    EventsGateway,
  ],
})
export class AppModule implements NestModule {
  private readonly isDev: boolean =
    process.env.NODE_ENV === 'dev' ? true : false;
  configure() {
    mongoose.set('debug', this.isDev);
  }
}
