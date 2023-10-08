import { Injectable } from "@nestjs/common";
import { EntityManager } from "typeorm";
import { Token } from "../entities/token.entity";

@Injectable()
export class TokenRepository {
  constructor(
    private readonly entityManager: EntityManager,
  ) {}

  async saveTokens(userId: number, refreshToken: string, socialAccessToken: string, socialRefreshToken: string): Promise<Token> {
    const token = new Token();
    token.userId = userId;
    token.refreshToken = refreshToken;
    token.socialAccessToken = socialAccessToken;
    token.socialRefreshToken = socialRefreshToken;

    return await this.entityManager.save(token);
  }
}