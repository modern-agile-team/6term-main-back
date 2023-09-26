import { AuthGuard } from '@nestjs/passport';
import { AuthService } from '../auth.service';
import { Controller, Get, Req, UseGuards } from '@nestjs/common';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get()
  getHello(): string {
    return 'Hello World!';
  }

  @Get('auth/naver')
  @UseGuards(AuthGuard('naver'))
  async naverAuth(@Req() req) {

  }

  @Get('auth/naver/callback')
  @UseGuards(AuthGuard('naver'))
  naverAuthRedirect(@Req() req) {
    return this.authService.naverLogin(req);
  }

  // @Get('auth/kakao')
  // @UseGuards(AuthGuard('kakao'))
  // async kakaoAuth(@Req() req) {
    
  // }

  @Get('auth/kakao/callback')
  @UseGuards(AuthGuard('kakao'))
  async kakaoAuthRedirect(@Req() req) {
    const { userId, kakaoAccessToken, kakaoRefreshToken } = await this.authService.kakaoLogin(req);
    const accessToken = await this.authService.createAccessToken(userId);
    const refreshToken = await this.authService.createRefreshToken(userId);
    
    return { accessToken, refreshToken, kakaoAccessToken, kakaoRefreshToken };
  }
}
