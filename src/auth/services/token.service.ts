import { Injectable } from '@nestjs/common';
import { TokenRepository } from '../repositories/token.repository';

@Injectable()
export class TokenService {
  constructor(
    private readonly tokenRepository: TokenRepository,
  ) {}

  async saveTokens(userId: number, refreshToken: string, socialAccessToken: string, socialRefreshToken: string) {
    return await this.tokenRepository.saveTokens(userId, refreshToken, socialAccessToken, socialRefreshToken);
  }
}