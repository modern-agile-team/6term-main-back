import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { VerifyCallback } from "jsonwebtoken";
import { Strategy } from "passport-google-oauth20";
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      scope: ['email', 'profile', 'openid'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any, done: VerifyCallback):
  Promise<any> {
    const { displayName, emails, photos } = profile;
    const user = {
      email: emails[0].value,
      name: displayName,
      picture: photos[0].value,
      accessToken,
    }
    console.log(profile);
    console.log(user);
    done(null, user);
  }
}