import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { User } from '@prisma/client';
import { FastifyRequest } from 'fastify';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { TypedConfigService } from 'src/config/typed-config.service';
import { LoggerService } from 'src/logger/logger.service';
import { AuthService } from './auth.service';
import { CookieNames } from './cookie-names.enum';

@Injectable()
export class JwtRefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh-token',
) {
  constructor(
    private readonly configService: TypedConfigService,
    private readonly logger: LoggerService,
    private readonly authService: AuthService,
  ) {
    const JWT_REFRESH_SECRET = configService.get('APP.jwtRefreshToken');

    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: FastifyRequest) => {
          const refreshToken = request.cookies?.[CookieNames.RefreshToken];

          if (!refreshToken) {
            this.logger.warn('Refresh token is missing in the cookies');
            throw new UnauthorizedException('Refresh token is missing');
          }
          return refreshToken;
        },
      ]),
      secretOrKey: JWT_REFRESH_SECRET,
      passReqToCallback: true,
    });
  }

  async validate(request: FastifyRequest, payload: User) {
    const refreshToken = request.cookies?.[CookieNames.RefreshToken];
    if (!refreshToken) {
      this.logger.warn('Refresh token is missing in the cookies');
      throw new UnauthorizedException('Refresh token is missing');
    }
    const user = this.authService.getUserIfRefreshTokenMatches(
      refreshToken,
      payload.email,
    );
    if (!user) {
      this.logger.warn(`User not found or hash not correct`);
      new UnauthorizedException({
        message: 'User not found or hash not correct',
      });
    }
    return user;
  }
}
