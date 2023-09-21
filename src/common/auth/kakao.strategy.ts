import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { VerifyCallback } from "jsonwebtoken";
import { Strategy } from 'passport-kakao';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class KakaoStrategy extends PassportStrategy(Strategy, 'kakao') {
  constructor() {
    super({
      clientID: process.env.KAKAO_CLIENT_ID,
      callbackURL: process.env.KAKAO_CALLBACK_URL,
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any, done: VerifyCallback) {
    const { provider, _json } = profile;
    
    if (provider == 'kakao') {
      _json.kakao_account.gender = _json.kakao_account.gender == 'male' ? 'M' : 'F';
    }

    const user = {
      provider,
      nickname: _json.properties.nickname,
      profileImage: _json.properties.profile_image,
      gender: _json.kakao_account.gender,
      email: _json.kakao_account.email,
    }
    console.log(user);

    done(null, user);
  }
}
