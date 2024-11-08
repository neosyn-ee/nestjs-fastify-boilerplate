import { Strategy, ExtractJwt } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { TypedConfigService } from 'src/config/typed-config.service';
import { User } from '@prisma/client';
import { LoggerService } from 'src/logger/logger.service';
import { FastifyRequest } from 'fastify';
import { CookieNames } from 'src/cookie/cookie-names.enum';
import { AuthService } from 'src/auth/auth.service';
import { ErrorCodes } from 'src/errors/error-codes.enum';

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
          // Check for the access token in cookies
          const accessTokenFromCookie =
            request.cookies?.[CookieNames.AccessToken];
          if (accessTokenFromCookie) return accessTokenFromCookie;

          // Use the passport-jwt's built-in extractor for the Bearer token in the Authorization header
          const accessTokenFromHeader =
            ExtractJwt.fromAuthHeaderAsBearerToken()(request as any);
          if (accessTokenFromHeader) return accessTokenFromHeader;

          // Log warning and throw exception if token is missing
          this.logger.warn(
            'Access token is missing in both cookies and headers',
          );
          throw new UnauthorizedException({
            message: 'Access token is missing',
            code: ErrorCodes.MISSING_TOKEN,
          });
        },
      ]),
      secretOrKey: JWT_SECRET,
    });
  }

  async validate(payload: User) {
    const user = this.authService.validateUserForJWTStrategy(payload.email);
    if (!user) {
      this.logger.warn(`User not found`);
      throw new UnauthorizedException({
        message: 'User not found',
        code: ErrorCodes.USER_NOT_FOUND,
      });
    }
    return user;
  }
}
