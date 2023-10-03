import { AuthGuard } from '@nestjs/passport';
import { AuthService } from '../service/auth.service';
import { Controller, Delete, Get, Headers, Req, UseGuards } from '@nestjs/common';
import { S3Service } from 'src/common/s3/s3.service';

@Controller()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private s3Service: S3Service
    ) {}

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
  async naverAuthRedirect(@Req() req) {
    const {userId, naverAccessToken, naverRefreshToken } = await this.authService.naverLogin(req);
    console.log("controller",userId);
    
    const accessToken = await this.authService.createAccessToken(userId);
    const refreshToken = await this.authService.createRefreshToken(userId);

    return { accessToken, refreshToken, naverAccessToken, naverRefreshToken };
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

  @Delete('auth/kakao/account')
  async kakaoAccountDelete(@Headers('Authorization') authorization: string) {
    const userId = await this.authService.decodeToken(authorization);
    await this.s3Service.deleteImagesWithPrefix(userId + '_');
    return await this.authService.kakaoAccountDelete(userId);
  }
}
