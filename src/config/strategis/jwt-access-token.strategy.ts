import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(
  Strategy,
  'jwt-access-token',
) {
  constructor() {
    super({
      jwtFromRequest: (req: Request) => {
        return req.headers['access_token'];
      },
      ignoreExpiration: true,
      secretOrKey: process.env.JWT_SECRET_KEY,
    });
  }

  async validate(payload: any) {
    console.log('validate: ', payload);
    
    return { userId: payload.userId };
  }

  async verifyToken(token: string) {
    console.log('verifyToken: ', token);
    
  }
}