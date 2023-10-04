import { Module } from '@nestjs/common';
import { AuthController } from '../controllers/auth.controller';
import { AuthService } from '../services/auth.service';
import { UserRepository } from 'src/users/repositories/user.repository';
import { NaverStrategy } from 'src/common/auth/naver.strategy';
import { KakaoStrategy } from 'src/common/auth/kakao.strategy';
import { S3Service } from 'src/common/s3/s3.service';
import { UserImageRepository } from 'src/users/repositories/user-image.repository';

@Module({
  imports: [],
  controllers: [AuthController],
  providers: [AuthService, UserRepository, UserImageRepository, NaverStrategy, KakaoStrategy, S3Service],
})
export class AuthModule {}
