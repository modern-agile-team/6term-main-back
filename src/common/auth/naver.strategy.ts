import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { VerifyCallback } from "jsonwebtoken";
import { Strategy } from 'passport-naver-v2';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class NaverStrategy extends PassportStrategy(Strategy, 'naver') {
  constructor() {
    super({
      clientID: process.env.NAVER_CLIENT_ID,
      clientSecret: process.env.NAVER_CLIENT_SECRET,
      callbackURL: process.env.NAVER_CALLBACK_URL,
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any, done: VerifyCallback) {
    const { nickname, profileImage, gender, email } = profile;

    const user = {
      nickname,
      profileImage,
      gender,
      email,
    }
    console.log(user);

    done(null, user);
  }
}
