import { AuthService } from '../services/auth.service';
import { BadRequestException, Controller, Delete, Get, Headers, Post, Query, Res } from '@nestjs/common';
import { S3Service } from 'src/common/s3/s3.service';
import { TokenService } from '../services/token.service';
import { ApiHeaders, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

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
  @ApiResponse({ status: 200, description: '성공적으로 액세스 토큰을 재발급 받은 경우', content: { JSON: { example: { accessToken: '여기에 액세스 토큰' } } } })
  @ApiResponse({ status: 403, description: '유효하지 않은 리프레시 토큰인 경우', content: { JSON: { example: { statusCode: 403, message: '유효하지 않은 토큰입니다.' } } } })
  @ApiHeaders([{ name: 'refresh_token', description: '리프레시 토큰', required: true, example: '여기에 리프레시 토큰' }])
  @Get('new-access-token')
  async newAccessToken(@Headers('refresh_token') refreshToken: string, @Res() res) {
    const userId = await this.tokenService.decodeToken(refreshToken);
    const newAccessToken = await this.tokenService.createAccessToken(userId);
    return res.json({ accessToken: newAccessToken });
  }

  @ApiOperation({ summary: '카카오 로그아웃 API', description: '카카오 로그아웃 API' })
  @ApiResponse({ status: 201, description: '성공적으로 로그아웃 된 경우', content: { JSON: { example: { message: "카카오 로그아웃이 완료되었습니다." } } } })
  @ApiResponse({ status: 403, description: '만료된 액세스 토큰인 경우', content: { JSON: { example: { statusCode: 403, message: '만료된 토큰입니다.' } } } })
  @ApiResponse({ status: 404, description: 'DB에서 토큰을 찾을 수 없는 경우', content: { JSON: { example: { statusCode: 404, message: '토큰을 찾을 수 없습니다.' } } } })
  @ApiHeaders([{ name: 'access_token', description: '액세스 토큰', required: true, example: '여기에 액세스 토큰' }])
  @Post('kakao/logout')
  async kakaoLogout(@Headers('access_token') accessToken: string) {
    const userId = await this.tokenService.decodeToken(accessToken);
    const { kakaoAccessToken, kakaoRefreshToken } = await this.tokenService.getUserTokens(userId)[0];
    await this.tokenService.deleteTokens(userId);
    return await this.authService.kakaoLogout(kakaoAccessToken, kakaoRefreshToken);
  }

  @ApiOperation({ summary: '카카오 회원탈퇴 API', description: '카카오 회원탈퇴 API' })
  @ApiResponse({ status: 201, description: '성공적으로 회원탈퇴 된 경우', content: { JSON: { example: { message: "카카오 연결 끊기가 완료되었습니다." } } } })
  @ApiResponse({ status: 403, description: '만료된 액세스 토큰인 경우', content: { JSON: { example: { statusCode: 403, message: '만료된 토큰입니다.' } } } })
  @ApiResponse({ status: 404, description: 'DB에서 토큰을 찾을 수 없는 경우', content: { JSON: { example: { statusCode: 404, message: '토큰을 찾을 수 없습니다.' } } } })
  @ApiHeaders([{ name: 'access_token', description: '액세스 토큰', required: true, example: '여기에 액세스 토큰' }])
  @Post('kakao/unlink')
  async kakaoUnlink(@Headers('access_token') accessToken: string) {
    const userId = await this.tokenService.decodeToken(accessToken);
    const { kakaoAccessToken, kakaoRefreshToken } = await this.tokenService.getUserTokens(userId)[0];
    await this.tokenService.deleteTokens(userId);
    return await this.authService.kakaoUnlink(kakaoAccessToken, kakaoRefreshToken);
  }

  @ApiOperation({ summary: '네이버 로그아웃 API', description: '네이버 로그아웃 API' })
  @ApiResponse({ status: 201, description: '성공적으로 로그아웃 된 경우', content: { JSON: { example: { message: "토큰 삭제 성공." } } } })
  @ApiResponse({ status: 403, description: '만료된 액세스 토큰인 경우', content: { JSON: { example: { statusCode: 403, message: '만료된 토큰입니다.' } } } })
  @ApiResponse({ status: 404, description: 'DB에서 토큰을 찾을 수 없는 경우', content: { JSON: { example: { statusCode: 404, message: '토큰을 찾을 수 없습니다.' } } } })
  @ApiHeaders([{ name: 'access_token', description: '액세스 토큰', required: true, example: '여기에 액세스 토큰' }])
  @Post('naver/logout')
  async naverLogout(@Headers('access_token') accessToken: string) {
    const userId = await this.tokenService.decodeToken(accessToken);
    return await this.tokenService.deleteTokens(userId);
  }

  @ApiOperation({ summary: '네이버 회원탈퇴 API', description: '네이버 회원탈퇴 API' })
  @ApiResponse({ status: 201, description: '성공적으로 회원탈퇴 된 경우', content: { JSON: { example: { message: "네이버 연동 해제가 완료되었습니다." } } } })
  @ApiResponse({ status: 403, description: '만료된 액세스 토큰인 경우', content: { JSON: { example: { statusCode: 403, message: '만료된 토큰입니다.' } } } })
  @ApiResponse({ status: 404, description: 'DB에서 토큰을 찾을 수 없는 경우', content: { JSON: { example: { statusCode: 404, message: '토큰을 찾을 수 없습니다.' } } } })
  @ApiHeaders([{ name: 'access_token', description: '액세스 토큰', required: true, example: '여기에 액세스 토큰' }])
  @Post('naver/unlink')
  async naverUnlink(@Headers('access_token') accessToken: string) {
    const userId = await this.tokenService.decodeToken(accessToken);
    const { naverAccessToken, naverRefreshToken } = await this.tokenService.getUserTokens(userId)[0];
    await this.tokenService.deleteTokens(userId);
    return await this.authService.naverUnlink(naverAccessToken, naverRefreshToken);
  }

  @ApiOperation({ summary: '계정 삭제 API', description: '계정 삭제 API' })
  @ApiResponse({ status: 200, description: '성공적으로 계정이 삭제 된 경우', content: { JSON: { example: { message: "사용자 계정 삭제에 성공했습니다." } } } })
  @ApiResponse({ status: 403, description: '만료된 액세스 토큰인 경우', content: { JSON: { example: { statusCode: 403, message: '만료된 토큰입니다.' } } } })
  @ApiResponse({ status: 404, description: 'DB에서 사용자를 찾을 수 없는 경우', content: { JSON: { example: { statusCode: 404, message: '사용자를 찾을 수 없습니다.' } } } })
  @ApiHeaders([{ name: 'access_token', description: '액세스 토큰', required: true, example: '여기에 액세스 토큰' }])
  @Delete('account')
  async accountDelete(@Headers('access_token') accessToken: string) {
    const userId = await this.tokenService.decodeToken(accessToken);
    await this.s3Service.deleteImagesWithPrefix(userId + '_');
    return await this.authService.accountDelete(userId);
  }
}
