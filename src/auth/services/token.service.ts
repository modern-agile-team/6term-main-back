import { Injectable } from '@nestjs/common';
import { TokenRepository } from '../repositories/token.repository';

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

  async deleteTokens(userId: number) {
    try {
      const del = await this.tokenRepository.deleteTokens(userId);
      console.log(del);
      
      return { status: true, message: '토큰 삭제 성공' };
    } catch (error) {
      console.error('토큰 삭제 오류:', error);
      return { status: false, message: '토큰 삭제 실패' };
    }
  }
}