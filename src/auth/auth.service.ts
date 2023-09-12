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
}
