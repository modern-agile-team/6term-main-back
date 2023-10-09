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
    return await this.tokenRepository.deleteTokens(userId);
  }
}