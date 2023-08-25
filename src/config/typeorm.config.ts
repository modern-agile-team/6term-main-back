import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Image } from 'src/uploads/image.entity';
import * as dotenv from 'dotenv';

// .env 파일 로드
dotenv.config();

export const TypeORMconfig: TypeOrmModuleOptions = {
  type: 'mysql',
  host: process.env.DATABASE_HOST,
  port: +process.env.DATABASE_PORT,
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  entities: [Image], // 여기에 엔티티들을 추가해야 합니다.
  synchronize: process.env.NODE_ENV === 'development', // 배포 시에는 false로 변경
  logging: true,
};
