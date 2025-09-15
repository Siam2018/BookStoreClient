import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET') || 'defaultSecret',
    });
  }

  async validate(payload: any) {
  console.log('JWTStrategy: Validating payload:', payload);
    const user = {
      id: payload.sub,
      userId: payload.sub,
      email: payload.email,
      role: payload.role,
      fullName: payload.fullName,
      imageURL: payload.imageURL,
    };
    console.log('JWTStrategy: Returning user:', user);
    return user;
  }
}
