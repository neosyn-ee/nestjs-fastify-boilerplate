import { Strategy, ExtractJwt } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { TypedConfigService } from 'src/config/typed-config.service';
import { User } from '@prisma/client';
import { AuthService } from './auth.service';
import { LoggerService } from 'src/logger/logger.service';
import { FastifyRequest } from 'fastify';
import { CookieNames } from './cookie-names.enum';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly authService: AuthService,
    private readonly logger: LoggerService,
    private readonly configService: TypedConfigService,
  ) {
    const JWT_SECRET = configService.get('APP.jwt');

    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: FastifyRequest) => {
          const accessToken = request.cookies?.[CookieNames.AccessToken];

          if (!accessToken) {
            this.logger.warn('Refresh token is missing in the cookies');
            throw new UnauthorizedException('Refresh token is missing');
          }
          return accessToken;
        },
      ]),
      secretOrKey: JWT_SECRET,
    });
  }

  async validate(payload: User) {
    const user = this.authService.validateUserForJWTStrategy(payload.email);
    if (!user) {
      this.logger.warn(`User not found`);
      new UnauthorizedException({
        message: 'User not found',
      });
    }
    return user;
  }
}
