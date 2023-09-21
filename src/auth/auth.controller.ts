import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { Controller, Get, Req, UseGuards } from '@nestjs/common';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get()
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req) {

  }

  @Get('auth/google/callback')
  @UseGuards(AuthGuard('google'))
  googleAuthRedirect(@Req() req) {
    return this.authService.googleLogin(req);
  }

  @Get()
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