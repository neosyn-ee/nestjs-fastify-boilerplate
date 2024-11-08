import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { AuthResponseDto } from './dto/login.dto';
import { LoggerService } from 'src/logger/logger.service';
import { BcryptService } from 'src/bcrypt/bcrypt.service';
import { JwtTokenService } from 'src/jwt/jwtToken.service';
import { TypedConfigService } from 'src/config/typed-config.service';
import { IJwtServicePayload } from 'src/jwt/jwt.interface';
import { User } from '@prisma/client';
import { ErrorCodes } from 'src/errors/error-codes.enum';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly bcryptService: BcryptService,
    private readonly logger: LoggerService,
    private readonly jwtTokenService: JwtTokenService,
    private readonly configService: TypedConfigService,
  ) {}

  async execute(email: string): Promise<Omit<User, 'password'> | null> {
    const user = await this.userService.getUserByEmail(email);
    if (!user) {
      return null;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...info } = user;
    return info;
  }

  private async createJwtToken(
    email: string,
    secretKey: string,
    expiresIn: string,
  ): Promise<string> {
    const payload: IJwtServicePayload = { email };
    return this.jwtTokenService.createToken(payload, secretKey, expiresIn);
  }

  async createRefreshJwtToken(email: string): Promise<string> {
    const accessToken = await this.createJwtToken(
      email,
      this.configService.get('APP.jwt'),
      this.configService.get('APP.jwtExpiresIn'),
    );
    return accessToken;
  }

  async createAccessJwtToken(email: string): Promise<string> {
    const refreshToken = await this.createJwtToken(
      email,
      this.configService.get('APP.jwtRefreshToken'),
      this.configService.get('APP.jwtRefreshTokenExpiresIn'),
    );
    return refreshToken;
  }

  async generateAuthCookies(
    email: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const accessToken = await this.createAccessJwtToken(email);
    const refreshToken = await this.createRefreshJwtToken(email);
    await this.setCurrentRefreshToken(refreshToken, email);
    return {
      accessToken,
      refreshToken,
    };
  }

  async validateUserForJWTStrategy(email: string) {
    const user = await this.userService.getUserByEmail(email);
    return user || null;
  }

  async getUserIfRefreshTokenMatches(refreshToken: string, email: string) {
    const user = await this.userService.getUserByEmail(email);
    if (!user || !user.hashRefreshToken) {
      this.logger.warn(`Refresh token missing or invalid for user ${email}`);
      throw new UnauthorizedException({
        message: 'Invalid refresh token',
        code: ErrorCodes.INVALID_REFRESH_TOKEN,
      });
    }
    const isTokenMatching =
      await this.jwtTokenService.verifyRefreshToken(refreshToken);

    return isTokenMatching ? user : null;
  }

  async validateUserForLocalStrategy(
    email: string,
    pass: string,
  ): Promise<Omit<User, 'password'> | null> {
    const user = await this.userService.getUserByEmail(email);
    if (!user) {
      return null;
    }
    if (!user.password) {
      throw new BadRequestException({
        message: 'Password cannot be null or undefined',
        code: ErrorCodes.PASSWORD_NOT_FOUND,
      });
    }
    const match = await this.bcryptService.compare(pass, user.password);
    if (user && match) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async setCurrentRefreshToken(refreshToken: string, email: string) {
    const hashedRefreshToken = await this.bcryptService.hash(refreshToken);
    await this.userService.updateRefreshToken(email, hashedRefreshToken);
  }

  async login(email: string, password: string): Promise<AuthResponseDto> {
    const user = await this.userService.getUserByEmail(email);
    if (!user) {
      throw new NotFoundException({
        message: `No user found for email: ${email}`,
        code: ErrorCodes.USER_NOT_FOUND,
      });
    }

    if (
      !user.password ||
      !(await this.bcryptService.compare(password, user.password))
    ) {
      throw new UnauthorizedException({
        message: 'Invalid credentials',
        code: ErrorCodes.INVALID_CREDENTIALS,
      });
    }

    this.logger.info(`User ${email} logged in successfully`);

    const { accessToken, refreshToken } = await this.generateAuthCookies(email);
    return { accessToken, refreshToken };
  }

  async signIn(email: string, password: string): Promise<AuthResponseDto> {
    const existingUser = await this.userService.getUserByEmail(email);
    if (existingUser) {
      throw new UnauthorizedException({
        message: 'User already exists',
        code: ErrorCodes.USER_ALREADY_EXISTS,
      });
    }

    const newUser = await this.userService.createUser({ email, password });
    const { accessToken, refreshToken } = await this.generateAuthCookies(
      newUser.email,
    );

    this.logger.info(`New user ${email} registered successfully`);
    return { accessToken, refreshToken };
  }
}
