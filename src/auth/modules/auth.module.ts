import { Module } from '@nestjs/common';
import { AuthController } from '../controllers/auth.controller';
import { AuthService } from '../auth.service';
import { UserRepository } from 'src/users/repository/user.repository';
import { NaverStrategy } from 'src/common/auth/naver.strategy';
import { KakaoStrategy } from 'src/common/auth/kakao.strategy';

@Module({
  imports: [],
  controllers: [AuthController],
  providers: [AuthService, UserRepository, NaverStrategy, KakaoStrategy],
})
export class AuthModule {}
