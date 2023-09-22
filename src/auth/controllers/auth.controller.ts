import { AuthGuard } from '@nestjs/passport';
import { AuthService } from '../auth.service';
import { Controller, Get, Req, UseGuards } from '@nestjs/common';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('auth/naver')
  @UseGuards(AuthGuard('naver'))
  async naverAuth(@Req() req) {

  }

  @Get('auth/naver/callback')
  @UseGuards(AuthGuard('naver'))
  naverAuthRedirect(@Req() req) {
    return this.authService.naverLogin(req);
  }

  @Get()
  @UseGuards(AuthGuard('kakao'))
  async kakaoAuth(@Req() req) {

  }

  @Get('auth/kakao/callback')
  @UseGuards(AuthGuard('kakao'))
  kakaoAuthRedirect(@Req() req) {
    return this.authService.kakaoLogin(req);
  }
}
