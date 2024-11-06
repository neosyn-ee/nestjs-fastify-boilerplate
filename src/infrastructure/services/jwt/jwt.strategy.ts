import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { LoggerService } from 'src/logger/logger.service';
import { FastifyReply } from 'fastify';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly authService: AuthService,
    private readonly logger: LoggerService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: FastifyReply) => {
          return request?.cookies?.Authentication ?? null;
        },
      ]),
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: any) {
    const user = this.authService.validateUserForJWTStragtegy(payload.username);
    if (!user) {
      this.logger.warn(`User not found`);
      throw new UnauthorizedException('User not found');
    }
    return user;
  }
}
