import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
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
  entities: [User], // 여기에 엔티티들을 추가해야 합니다.
  synchronize: process.env.NODE_ENV === 'development', // 배포 시에는 false로 변경
  logging: true,
};
