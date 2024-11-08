import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { User } from '@prisma/client';
import { FastifyRequest } from 'fastify';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { TypedConfigService } from 'src/config/typed-config.service';
import { LoggerService } from 'src/logger/logger.service';
import { CookieNames } from 'src/cookie/cookie-names.enum';
import { AuthService } from 'src/auth/auth.service';
import { ErrorCodes } from 'src/errors/error-codes.enum';

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
          const refreshTokenFromCookie =
            request.cookies?.[CookieNames.RefreshToken];
          if (refreshTokenFromCookie) {
            return refreshTokenFromCookie;
          }

          const refreshTokenFromHeader =
            ExtractJwt.fromAuthHeaderAsBearerToken()(request as any);
          if (refreshTokenFromHeader) {
            return refreshTokenFromHeader;
          }

          this.logger.warn(
            'Refresh token is missing in both cookies and headers',
          );
          throw new UnauthorizedException({
            message: 'Refresh token is missing',
            code: ErrorCodes.MISSING_REFRESH_TOKEN,
          });
        },
      ]),
      secretOrKey: JWT_REFRESH_SECRET,
      passReqToCallback: true,
    });
  }

  async validate(request: FastifyRequest, payload: User) {
    const refreshToken =
      request.cookies?.[CookieNames.RefreshToken] ||
      ExtractJwt.fromAuthHeaderAsBearerToken()(request as any);

    if (!refreshToken) {
      this.logger.warn('Refresh token is missing in both cookies and headers');
      throw new UnauthorizedException({
        message: 'Refresh token is missing',
        code: ErrorCodes.MISSING_REFRESH_TOKEN,
      });
    }

    const user = await this.authService.getUserIfRefreshTokenMatches(
      refreshToken,
      payload.email,
    );

    if (!user) {
      this.logger.warn(`User not found or hash not correct`);
      throw new UnauthorizedException({
        message: 'User not found or hash not correct',
        code: ErrorCodes.USER_NOT_FOUND,
      });
    }

    return user;
  }
}
