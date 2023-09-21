import { Injectable } from '@nestjs/common';
import { UserRepository } from 'src/users/repository/user.repository';

@Injectable()
export class AuthService {
  constructor(private readonly userRepository: UserRepository) {}

  googleLogin(req) {
    if(!req.user) {
      return 'No user from google'
    }
    return {
      message: 'User Info from google',
      user: req.user
    }
  }

  async naverLogin(req) {
    const userInfo = req.user; // 네이버에서 전달받은 사용자 정보

    const existingUser = await this.userRepository.findByEmail(userInfo.email);

    if (existingUser) { // 이미 존재하는 사용자인 경우
      return "이미 존재하는 사용자입니다.";
    } else { // 존재하지 않는 사용자인 경우
      const newUser = await this.userRepository.createUser(userInfo);
      return newUser;
    }
  }

  kakaoLogin(req) {
    if(!req.user) {
      return 'No user from kakao'
    }
    return {
      message: 'User Info from kakao',
      user: req.user
    }
  }
}
