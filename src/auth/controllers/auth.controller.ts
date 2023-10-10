import { AuthGuard } from '@nestjs/passport';
import { AuthService } from '../services/auth.service';
import { Controller, Delete, Get, Headers, Post, Req, Res, UseGuards } from '@nestjs/common';
import { S3Service } from 'src/common/s3/s3.service';
import { TokenService } from '../services/token.service';
import { ApiTags } from '@nestjs/swagger';

@Controller('auth')
@ApiTags('auth API')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private tokenService: TokenService,
    private s3Service: S3Service
    ) {}

  @Get('naver/callback')
  @UseGuards(AuthGuard('naver'))
  async naverAuthRedirect(@Req() req) {
    const {userId, naverAccessToken, naverRefreshToken } = await this.authService.naverLogin(req);
    const accessToken = await this.authService.createAccessToken(userId);
    const refreshToken = await this.authService.createRefreshToken(userId);

    await this.tokenService.saveTokens(userId, refreshToken, naverAccessToken, naverRefreshToken);

    return { accessToken, refreshToken };
  }

  @Get('kakao/callback')
  @UseGuards(AuthGuard('kakao'))
  async kakaoAuthRedirect(@Req() req, @Res() res) {
    const { userId, kakaoAccessToken, kakaoRefreshToken } = await this.authService.kakaoLogin(req);
    const accessToken = await this.authService.createAccessToken(userId);
    const refreshToken = await this.authService.createRefreshToken(userId);

    await this.tokenService.saveTokens(userId, refreshToken, kakaoAccessToken, kakaoRefreshToken);

    res.json({ accessToken, refreshToken });
    console.log(accessToken, refreshToken);
    
    return { accessToken, refreshToken };
  }

  @Get('new-access-token')
  async newAccessToken(@Headers('refresh_token') refreshToken: string) {
    const userId = await this.authService.decodeToken(refreshToken);
    return await this.authService.createAccessToken(userId);
  }

  @Post('kakao/logout')
  async kakaoLogout(@Headers('access_token') accessToken: string) {
    const userId = await this.authService.decodeToken(accessToken);
    const tokens = await this.tokenService.getUserTokens(userId);
    let kakaoAccessToken = tokens[0].socialAccessToken;

    const checkValidKakaoToken = await this.tokenService.checkValidKakaoToken(kakaoAccessToken);

    if (checkValidKakaoToken === 401) {
      const kakaoRefreshToken = tokens[0].socialRefreshToken;
      const newKakaoToken = await this.tokenService.getNewKakaoToken(kakaoRefreshToken);
      kakaoAccessToken = newKakaoToken.access_token;
    }
    await this.tokenService.deleteTokens(userId);
    return await this.authService.kakaoLogout(kakaoAccessToken);
  }

  @Post('kakao/unlink')
  async kakaoUnlink(@Headers('access_token') accessToken: string) {
    const userId = await this.authService.decodeToken(accessToken);
    const tokens = await this.tokenService.getUserTokens(userId);
    let kakaoAccessToken = tokens[0].socialAccessToken;

    const checkValidKakaoToken = await this.tokenService.checkValidKakaoToken(kakaoAccessToken);

    if (checkValidKakaoToken === 401) {
      const kakaoRefreshToken = tokens[0].socialRefreshToken;
      const newKakaoToken = await this.tokenService.getNewKakaoToken(kakaoRefreshToken);
      kakaoAccessToken = newKakaoToken.access_token;
    }
    await this.tokenService.deleteTokens(userId);
    return await this.authService.kakaoUnlink(kakaoAccessToken);
  }

  @Post('naver/logout')
  async naverLogout(@Headers('access_token') accessToken: string) {
    const userId = await this.authService.decodeToken(accessToken);
  
    return await this.tokenService.deleteTokens(userId);
  }

  @Post('naver/unlink')
  async naverUnlink(@Headers('access_token') accessToken: string) {
    const userId = await this.authService.decodeToken(accessToken);
    const tokens = await this.tokenService.getUserTokens(userId);
    let naverAccessToken = tokens[0].socialAccessToken;

    const checkValidNaverToken = await this.tokenService.checkValidNaverToken(naverAccessToken);

    if (checkValidNaverToken === 401) {
      const naverRefreshToken = tokens[0].socialRefreshToken;
      const newNaverToken = await this.tokenService.getNewNaverToken(naverRefreshToken);      
      naverAccessToken = newNaverToken.access_token;
    }
    await this.tokenService.deleteTokens(userId);
    return await this.authService.naverUnlink(naverAccessToken);
  }

  @Delete('account')
  async accountDelete(@Headers('access_token') accessToken: string) {
    const userId = await this.authService.decodeToken(accessToken);
    await this.s3Service.deleteImagesWithPrefix(userId + '_');
    return await this.authService.accountDelete(userId);
  }
}
