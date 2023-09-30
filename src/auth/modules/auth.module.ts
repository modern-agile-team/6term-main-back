import { Module } from '@nestjs/common';
import { AuthController } from '../controllers/auth.controller';
import { AuthService } from '../service/auth.service';
import { UserRepository } from 'src/users/repository/user.repository';
import { NaverStrategy } from 'src/common/auth/naver.strategy';
import { KakaoStrategy } from 'src/common/auth/kakao.strategy';
import { S3Service } from 'src/common/s3/s3.service';

@Module({
  imports: [],
  controllers: [AuthController],
  providers: [AuthService, UserRepository, NaverStrategy, KakaoStrategy, S3Service],
})
export class AuthModule {}
