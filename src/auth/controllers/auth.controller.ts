import { AuthService } from '../services/auth.service';
import { BadRequestException, Controller, Delete, Get, Headers, Post, Query, Res } from '@nestjs/common';
import { S3Service } from 'src/common/s3/s3.service';
import { TokenService } from '../services/token.service';
import { ApiTags } from '@nestjs/swagger';
import { ApiNaverLogin } from '../swagger-decorators/naver-login.decorator';
import { ApiKakaoLogin } from '../swagger-decorators/kakao-login.decorator';
import { ApiNewAccessToken } from '../swagger-decorators/new-access-token.decorator';
import { ApiKakaoLogout } from '../swagger-decorators/kakao-logout.decorator';
import { ApiKakaoUnlink } from '../swagger-decorators/kakao-unlink.decorator';
import { ApiNaverLogout } from '../swagger-decorators/naver-logout.decorator';
import { ApiNaverUnlink } from '../swagger-decorators/naver-unlink.decorator';
import { ApiDeleteAccount } from '../swagger-decorators/delete-account.decorator';

@Controller('auth')
@ApiTags('auth API')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private tokenService: TokenService,
    private s3Service: S3Service
  ) {}

  @ApiNaverLogin()
  @Get('naver/login')
  async naverLogin(@Query() { code }, @Res() res) {
    if (!code) {
      throw new BadRequestException('인가코드가 없습니다.');
    }
    
    const { userId, naverAccessToken, naverRefreshToken } = await this.authService.naverLogin(code);
    const accessToken = await this.tokenService.createAccessToken(userId);
    const refreshToken = await this.tokenService.createRefreshToken(userId);

    await this.tokenService.saveTokens(userId, refreshToken, naverAccessToken, naverRefreshToken);

    return res.json({ accessToken, refreshToken });
  }

  @ApiKakaoLogin()
  @Get('kakao/login')
  async kakaoLogin(@Query() { code }, @Res() res) {
    if (!code) {
      throw new BadRequestException('인가코드가 없습니다.');
    }

    const { userId, kakaoAccessToken, kakaoRefreshToken } = await this.authService.kakaoLogin(code);
    const accessToken = await this.tokenService.createAccessToken(userId);
    const refreshToken = await this.tokenService.createRefreshToken(userId);

    await this.tokenService.saveTokens(userId, refreshToken, kakaoAccessToken, kakaoRefreshToken);

    return res.json({ accessToken, refreshToken });
  }

  @ApiNewAccessToken()
  @Get('new-access-token')
  async newAccessToken(@Headers('refresh_token') refreshToken: string, @Res() res) {
    const userId = await this.tokenService.decodeToken(refreshToken);
    const newAccessToken = await this.tokenService.createAccessToken(userId);
    return res.json({ accessToken: newAccessToken });
  }

  @ApiKakaoLogout()
  @Post('kakao/logout')
  async kakaoLogout(@Headers('access_token') accessToken: string) {
    const userId = await this.tokenService.decodeToken(accessToken);
    const { kakaoAccessToken, kakaoRefreshToken } = await this.tokenService.getUserTokens(userId)[0];
    await this.tokenService.deleteTokens(userId);
    return await this.authService.kakaoLogout(kakaoAccessToken, kakaoRefreshToken);
  }

  @ApiKakaoUnlink()
  @Post('kakao/unlink')
  async kakaoUnlink(@Headers('access_token') accessToken: string) {
    const userId = await this.tokenService.decodeToken(accessToken);
    const { kakaoAccessToken, kakaoRefreshToken } = await this.tokenService.getUserTokens(userId)[0];
    await this.tokenService.deleteTokens(userId);
    return await this.authService.kakaoUnlink(kakaoAccessToken, kakaoRefreshToken);
  }

  @ApiNaverLogout()
  @Post('naver/logout')
  async naverLogout(@Headers('access_token') accessToken: string) {
    const userId = await this.tokenService.decodeToken(accessToken);
    return await this.tokenService.deleteTokens(userId);
  }

  @ApiNaverUnlink()
  @Post('naver/unlink')
  async naverUnlink(@Headers('access_token') accessToken: string) {
    const userId = await this.tokenService.decodeToken(accessToken);
    const { naverAccessToken, naverRefreshToken } = await this.tokenService.getUserTokens(userId)[0];
    await this.tokenService.deleteTokens(userId);
    return await this.authService.naverUnlink(naverAccessToken, naverRefreshToken);
  }

  @ApiDeleteAccount()
  @Delete('account')
  async accountDelete(@Headers('access_token') accessToken: string) {
    const userId = await this.tokenService.decodeToken(accessToken);
    await this.s3Service.deleteImagesWithPrefix(userId + '_');
    return await this.authService.accountDelete(userId);
  }
}
