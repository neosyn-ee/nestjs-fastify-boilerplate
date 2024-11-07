import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { LoggerService } from 'src/logger/logger.service';
import { AuthService } from './auth.service';
import { User } from '@prisma/client';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly logger: LoggerService,
    private readonly authService: AuthService,
  ) {
    super();
  }

  async validate(
    email: string,
    password: string,
  ): Promise<Omit<User, 'password'> | null> {
    if (!email || !password) {
      this.logger.warn(`email or password is missing, BadRequestException`);
      new UnauthorizedException();
    }
    const user = await this.authService.validateUserForLocalStrategy(
      email,
      password,
    );
    if (!user) {
      this.logger.warn(`Invalid email or password`);
      new UnauthorizedException({
        message: 'Invalid email or password.',
      });
    }
    return user;
  }
}
