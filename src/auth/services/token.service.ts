import { Injectable } from '@nestjs/common';
import { TokenRepository } from '../repositories/token.repository';
import axios from 'axios';

@Injectable()
export class TokenService {
  constructor(
    private readonly tokenRepository: TokenRepository,
  ) {}

  async getUserTokens(userId: number) {
    return await this.tokenRepository.getUserTokens(userId);
  }

  async saveTokens(userId: number, refreshToken: string, socialAccessToken: string, socialRefreshToken: string) {
    const tokens = await this.tokenRepository.getUserTokens(userId);
    
    if (tokens.length > 0) {
      return await this.tokenRepository.updateTokens(userId, refreshToken, socialAccessToken, socialRefreshToken);
    }
    return await this.tokenRepository.saveTokens(userId, refreshToken, socialAccessToken, socialRefreshToken);
  }

  async checkValidKakaoToken(accessToken: string) {
    try {
      const kakaoUnlinkUrl = 'https://kapi.kakao.com/v1/user/access_token_info';
      const kakaoUnlinkHeader = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };

      return (await axios.get(kakaoUnlinkUrl, kakaoUnlinkHeader)).status;
    } catch (error) {
      console.error('카카오 토큰 유효성 검사 오류:', error);
      return false;
    }
  }

  async getNewKakaoToken(refreshToken: string) {
    try {
      const kakaoTokenUrl = 'https://kauth.kakao.com/oauth/token';
      const kakaoTokenHeader = {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
        },
      };
      const kakaoTokenData = {
        grant_type: 'refresh_token',
        client_id: process.env.KAKAO_CLIENT_ID,
        refresh_token: refreshToken,
      };

      return (await axios.post(kakaoTokenUrl, kakaoTokenData, kakaoTokenHeader)).data;
    } catch (error) {
      console.error('카카오 토큰 갱신 오류:', error);
      return false;
    }
  }

  async checkValidNaverToken(accessToken: string) {
    try {
      const naverUnlinkUrl = 'https://openapi.naver.com/v1/nid/me';
      const naverUnlinkHeader = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };
      return (await axios.get(naverUnlinkUrl, naverUnlinkHeader)).status;
    } catch (error) {
      
    }
  }

  async getNewNaverToken(refreshToken: string) {
    try {
      const naverTokenUrl = 'https://nid.naver.com/oauth2.0/token';
      // const naverTokenHeader = {
      //   headers: {
      //     'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
      //   },
      // };
      const naverTokenData = {
        grant_type: 'refresh_token',
        client_id: process.env.NAVER_CLIENT_ID,
        client_secret: process.env.NAVER_CLIENT_SECRET,
        refresh_token: refreshToken,
      };

      return (await axios.post(naverTokenUrl, naverTokenData)).data;
    } catch (error) {
      console.error('네이버 토큰 갱신 오류:', error);
      return false;
    }
  }

  async deleteTokens(userId: number) {
    try {
      await this.tokenRepository.deleteTokens(userId);
      
      return { status: true, message: '토큰 삭제 성공' };
    } catch (error) {
      console.error('토큰 삭제 오류:', error);
      return { status: false, message: '토큰 삭제 실패' };
    }
  }
}
