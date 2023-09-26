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
    const kakaoAccessToken = userInfo.accessToken;
    const kakaoRefreshToken = userInfo.refreshToken;
    
    const checkProvider = await this.userRepository.findByProvider(userInfo.user.provider);
    const checkEmail = await this.userRepository.findByEmail(userInfo.user.email);
    const checkName = await this.userRepository.findByName(userInfo.user.nickname);
      
    if (checkProvider && checkEmail && checkName) { // 이미 존재하는 사용자인 경우
      const userId = checkProvider.id;

      return { userId, kakaoAccessToken, kakaoRefreshToken };
    } else { // 존재하지 않는 사용자인 경우
      const newUser = await this.userRepository.createUser(userInfo.user);
      const userId = newUser.id;
      if (!userInfo.user.profileImage) {
        await this.userRepository.uploadUserImage(userId, process.env.DEFAULT_USER_IMAGE);
      }
      await this.userRepository.uploadUserImage(userId, userInfo.user.profileImage);

      return { userId, kakaoAccessToken, kakaoRefreshToken };
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

  async verifyToken(accessToken: string) {
    const jwtSecretKey = process.env.JWT_SECRET_KEY;
    const verifyToken = jwt.verify(accessToken, jwtSecretKey);
    if (verifyToken) {
      return { status: true, message: "유효한 토큰입니다." };
    }
    return { status: false, message: "유효하지 않은 토큰입니다." };
  }

  async decodeToken(accessToken: string) {
    const payload = jwt.decode(accessToken);
    const userId = payload['userId'];
    return userId;
  }
}
