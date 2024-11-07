import {
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
      throw new UnauthorizedException('Invalid refresh token');
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
      throw new Error('Password cannot be null or undefined');
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
      throw new NotFoundException(`No user found for email: ${email}`);
    }

    if (
      !user.password ||
      !(await this.bcryptService.compare(password, user.password))
    ) {
      throw new UnauthorizedException('Invalid credentials');
    }

    this.logger.info(`User ${email} logged in successfully`);

    const { accessToken, refreshToken } = await this.generateAuthCookies(email);
    return { accessToken, refreshToken };
  }

  async signIn(email: string, password: string): Promise<AuthResponseDto> {
    const existingUser = await this.userService.getUserByEmail(email);
    if (existingUser) {
      throw new UnauthorizedException('User already exists');
    }

    const newUser = await this.userService.createUser({ email, password });
    const { accessToken, refreshToken } = await this.generateAuthCookies(
      newUser.email,
    );

    this.logger.info(`New user ${email} registered successfully`);
    return { accessToken, refreshToken };
  }
}
