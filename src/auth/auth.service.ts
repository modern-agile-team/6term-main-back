import { Injectable } from '@nestjs/common';
import { UserRepository } from 'src/users/repository/user.repository';
import * as jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class AuthService {
  constructor(private readonly userRepository: UserRepository) {}

  async naverLogin(req) {
    const userInfo = req.user; // 네이버에서 전달받은 사용자 정보

    const checkProvider = await this.userRepository.findByProvider(userInfo.provider);
    const checkEmail = await this.userRepository.findByEmail(userInfo.email);
    const checkName = await this.userRepository.findByName(userInfo.nickname);

    if (checkProvider && checkEmail && checkName) { // 이미 존재하는 사용자인 경우
      return "이미 존재하는 사용자입니다.";
    } else { // 존재하지 않는 사용자인 경우
      const newUser = await this.userRepository.createUser(userInfo);
      return newUser;
    }
  }

  async kakaoLogin(req) {
    const userInfo = req.user; // 카카오에서 전달받은 사용자 정보

    const checkProvider = await this.userRepository.findByProvider(userInfo.provider);
    const checkEmail = await this.userRepository.findByEmail(userInfo.email);
    const checkName = await this.userRepository.findByName(userInfo.nickname);

    if (checkProvider && checkEmail && checkName) { // 이미 존재하는 사용자인 경우
      const userId = checkProvider.id;
      return userId;
    } else { // 존재하지 않는 사용자인 경우
      const newUser = await this.userRepository.createUser(userInfo);
      const userId = newUser.id;
      return userId;
    }
  }

  async createAccessToken(userId: number) {
    const jwtSecretKey = process.env.JWT_SECRET_KEY;
    const payload = {
      sub: "accessToken",
      userId,
      exp: Math.floor(Date.now() / 1000) + (60 * 60), // 1시간
    };

    const accessToken = jwt.sign(payload, jwtSecretKey);

    return accessToken;
  }

  async createRefreshToken(userId: number) {
    const jwtSecretKey = process.env.JWT_SECRET_KEY;
    const payload = {
      sub: "refreshToken",
      userId,
      exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 7), // 7일
    };
    const refreshToken = jwt.sign(payload, jwtSecretKey);

    return refreshToken;
  }
}
