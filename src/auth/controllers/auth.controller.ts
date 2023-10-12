import { AuthService } from '../services/auth.service';
import { BadRequestException, Controller, Delete, Get, Headers, Post, Query, Res } from '@nestjs/common';
import { S3Service } from 'src/common/s3/s3.service';
import { TokenService } from '../services/token.service';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('auth')
@ApiTags('auth API')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private tokenService: TokenService,
    private s3Service: S3Service
  ) {}

  @ApiOperation({ summary: '네이버 로그인 API', description: '네이버 로그인 API' })
  @ApiResponse({ status: 200, description: '성공적으로 로그인 된 경우', content: { JSON: { example: { accessToken: '여기에 액세스 토큰', refreshToken: '여기에 리프레시 토큰' } } } })
  @ApiResponse({ status: 400, description: '인가코드가 없는 경우', content: { JSON: { example: { message: '인가코드가 없습니다.', error:'Bad Request', statusCode: 400 } } } })
  @ApiResponse({ status: 401, description: '유효하지 않은 인가코드인 경우', content: { JSON: { example: { statusCode: 401, message: '유효하지 않은 인가코드입니다.' } } } })
  @ApiQuery({ name: 'code', description: '네이버 인가코드', required: true, example: 'aNUgOlLlmyxNehJjqW' })
  @ApiQuery({ name: 'state', description: '네이버 인가 요청 시 전달한 상태 토큰', required: true, example: 'test' })
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

  @ApiOperation({ summary: '카카오 로그인 API', description: '카카오 로그인 API' })
  @ApiResponse({ status: 200, description: '성공적으로 로그인 된 경우', content: { JSON: { example: { accessToken: '여기에 액세스 토큰', refreshToken: '여기에 리프레시 토큰' } } } })
  @ApiResponse({ status: 400, description: '인가코드가 없는 경우', content: { JSON: { example: { message: '인가코드가 없습니다.', error:'Bad Request', statusCode: 400 } } } })
  @ApiResponse({ status: 401, description: '유효하지 않은 인가코드인 경우', content: { JSON: { example: { statusCode: 401, message: '유효하지 않은 인가코드입니다.' } } } })
  @ApiQuery({ name: 'code', description: '카카오 인가코드', required: true, example: 'ksqUzF0XZfE7pz5vcyZ2m0GvdxXkwJ9mlgDDGo1_RPD55vvOeydu-Qx4xNjuz8gnUnUFPAo9cxgAAAGLIusfpw' })
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

  @ApiOperation({ summary: '액세스 토큰 재발급 API', description: '액세스 토큰 재발급 API' })
  // @ApiResponse()
  @Get('new-access-token')
  async newAccessToken(@Headers('refresh_token') refreshToken: string, @Res() res) {
    const userId = await this.tokenService.decodeToken(refreshToken);
    const newAccessToken = await this.tokenService.createAccessToken(userId);
    return res.json({ accessToken: newAccessToken });
  }

  @Post('kakao/logout')
  async kakaoLogout(@Headers('access_token') accessToken: string) {
    const userId = await this.tokenService.decodeToken(accessToken);
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
    const userId = await this.tokenService.decodeToken(accessToken);
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
    const userId = await this.tokenService.decodeToken(accessToken);
  
    return await this.tokenService.deleteTokens(userId);
  }

  @Post('naver/unlink')
  async naverUnlink(@Headers('access_token') accessToken: string) {
    const userId = await this.tokenService.decodeToken(accessToken);
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
    const userId = await this.tokenService.decodeToken(accessToken);
    await this.s3Service.deleteImagesWithPrefix(userId + '_');
    return await this.authService.accountDelete(userId);
  }
}
