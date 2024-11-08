import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { IJwtService } from './jwt.interface';
import { TypedConfigService } from 'src/config/typed-config.service';
import { LoggerService } from 'src/logger/logger.service';
import { ErrorCodes } from 'src/errors/error-codes.enum';

@Injectable()
export class JwtTokenService implements IJwtService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: TypedConfigService,
    private readonly logger: LoggerService,
  ) {}

  async checkToken(token: string): Promise<any> {
    const decode = await this.jwtService.verifyAsync(token);
    return decode;
  }

  async verifyRefreshToken(refreshToken: string): Promise<any> {
    try {
      const decodedInfoUser: any = await this.jwtService.verifyAsync(
        refreshToken,
        {
          secret: this.configService.get('APP.jwtRefreshToken'),
        },
      );
      return decodedInfoUser;
    } catch (error) {
      this.logger.error(`Invalid token: ${error}`);
      throw new BadRequestException({
        message: `Invalid token: ${error}`,
        code: ErrorCodes.INVALID_TOKEN,
      });
    }
  }

  createToken<T extends object>(
    payload: T,
    secret: string,
    expiresIn: string,
  ): string {
    return this.jwtService.sign(payload, {
      secret: secret,
      expiresIn: expiresIn,
    });
  }
}
