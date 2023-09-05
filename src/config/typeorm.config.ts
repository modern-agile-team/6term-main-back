import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
import { BoardImage } from 'src/boards/entities/board-image.entity';
import { BoardLike } from 'src/boards/entities/board-like.entity';
import { Board } from 'src/boards/entities/board.entity';
import { CommentLike } from 'src/comments/entities/comment-like.entity';
import { Comment } from 'src/comments/entities/comment.entity';
import { Recomment } from 'src/comments/entities/recomment.entity';
import { Friend } from 'src/friend/entities/friend.entity';
import { BoardNotification } from 'src/notice/entities/board-notice.entity';
import { CommentNotification } from 'src/notice/entities/comment-notice.entity';
import { UserImage } from 'src/users/entities/user-image.entity';
import { User } from 'src/users/entities/user.entity';

// .env 파일 로드
dotenv.config();

export const TypeORMconfig: TypeOrmModuleOptions = {
  type: 'mysql',
  host: process.env.DATABASE_HOST,
  port: +process.env.DATABASE_PORT,
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  entities: [
    User,
    UserImage,
    Board, 
    BoardImage, 
    BoardLike, 
    Comment, 
    CommentLike, 
    Recomment, 
    Friend, 
    BoardNotification, 
    CommentNotification 
  ],  // 여기에 엔티티들을 추가해야 합니다.
  synchronize: process.env.NODE_ENV === 'development', // 배포 시에는 false로 변경
  logging: true,
};
