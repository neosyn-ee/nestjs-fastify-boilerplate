import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { TypedConfigService } from 'src/config/typed-config.service';
import { LoggerService } from 'src/logger/logger.service';
import { FastifyReply } from 'fastify';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class JwtRefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh-token',
) {
  constructor(
    private readonly configService: TypedConfigService,
    private readonly authService: AuthService,
    private readonly logger: LoggerService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: FastifyReply) => {
          if (!request?.cookies?.Refresh) {
            this.logger.warn(
              'Refresh token from cookie is missing or undefined',
            );
            throw new UnauthorizedException('Refresh token is missing');
          }
          return request.cookies.Refresh;
        },
      ]),
      secretOrKey: configService.get('APP.jwtRefreshToken'),
      passReqToCallback: true,
    });
  }
  //TODO: add correct type for payload
  async validate(request: FastifyReply, payload: any) {
    const refreshToken = request.cookies?.Refresh;
    if (!refreshToken) {
      this.logger.warn('Refresh token is missing or undefined');
      throw new UnauthorizedException('Refresh token is missing');
    }
    const user = this.authService.getUserIfRefreshTokenMatches(
      refreshToken,
      payload.username,
    );
    if (!user) {
      this.logger.warn(`User not found or hash not correct`);
      throw new UnauthorizedException('User not found or hash not correct');
    }
    return user;
  }
}
