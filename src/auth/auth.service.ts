import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  googleLogin(req) {
    if(!req.user) {
      return 'No user from google'
    }
    return {
      message: 'User Info from google',
      user: req.user
    }
  }

  naverLogin(req) {
    if(!req.user) {
      return 'No user from naver'
    }
    return {
      message: 'User Info from naver',
      user: req.user
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
