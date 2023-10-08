import { AuthGuard } from '@nestjs/passport';
import { AuthService } from '../services/auth.service';
import { Controller, Delete, Get, Headers, Req, UseGuards } from '@nestjs/common';
import { S3Service } from 'src/common/s3/s3.service';
import { TokenService } from '../services/token.service';

@Controller()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private tokenService: TokenService,
    private s3Service: S3Service
    ) {}

  @Get('auth/naver/callback')
  @UseGuards(AuthGuard('naver'))
  async naverAuthRedirect(@Req() req) {
    const {userId, naverAccessToken, naverRefreshToken } = await this.authService.naverLogin(req);
    const accessToken = await this.authService.createAccessToken(userId);
    const refreshToken = await this.authService.createRefreshToken(userId);

    await this.tokenService.saveTokens(userId, refreshToken, naverAccessToken, naverRefreshToken);

    return { accessToken, refreshToken };
  }

  @Get('auth/kakao/callback')
  @UseGuards(AuthGuard('kakao'))
  async kakaoAuthRedirect(@Req() req) {
    const { userId, kakaoAccessToken, kakaoRefreshToken } = await this.authService.kakaoLogin(req);
    const accessToken = await this.authService.createAccessToken(userId);
    const refreshToken = await this.authService.createRefreshToken(userId);

    await this.tokenService.saveTokens(userId, refreshToken, kakaoAccessToken, kakaoRefreshToken);

    return { accessToken, refreshToken };
  }

  @Get('auth/new-access-token')
  async newAccessToken(@Headers('refresh_token') refreshToken: string) {
    const userId = await this.authService.decodeToken(refreshToken);
    return await this.authService.createAccessToken(userId);
  }

  @Delete('auth/account')
  async accountDelete(@Headers('access_token') accessToken: string) {
    const userId = await this.authService.decodeToken(accessToken);
    await this.s3Service.deleteImagesWithPrefix(userId + '_');
    return await this.authService.accountDelete(userId);
  }
}
