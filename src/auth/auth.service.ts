import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { TypedConfigService } from 'src/config/typed-config.service';
import { BcryptService } from 'src/infrastructure/services/bcrypt/bcrypt.service';
import { IJwtServicePayload } from 'src/infrastructure/services/jwt/jwt.interface';
import { JwtTokenService } from 'src/infrastructure/services/jwt/JwtToken.service';
import { LoggerService } from 'src/logger/logger.service';
import { UserService } from 'src/user/user.service';
import { AuthResponseDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly bcryptService: BcryptService,
    private readonly logger: LoggerService,
    private readonly jwtTokenService: JwtTokenService,
    private readonly configService: TypedConfigService,
  ) {}

  async validateUserForJWTStragtegy(email: string) {
    const user = await this.userService.getUserByEmail(email);
    if (!user) {
      return null;
    }
    return user;
  }

  async getUserIfRefreshTokenMatches(refreshToken: string, email: string) {
    const user = await this.userService.getUserByEmail(email);
    if (!user) {
      return null;
    }
    if (!user.hashRefreshToken) {
      this.logger.warn('User refresh token is missing or undefined');
      throw new UnauthorizedException('Refresh token is missing');
    }

    const isRefreshTokenMatching = await this.bcryptService.compare(
      refreshToken,
      user.hashRefreshToken,
    );
    if (isRefreshTokenMatching) {
      return user;
    }

    return null;
  }

  async getCookieWithJwtToken(email: string) {
    this.logger.info(`The user ${email} have been logged.`);
    const payload: IJwtServicePayload = { email };
    const secret = this.configService.get('APP.jwt');
    const expiresIn = this.configService.get('APP.jwtExpiresIn');
    const token = this.jwtTokenService.createToken(payload, secret, expiresIn);
    return `Authentication=${token}; HttpOnly; Path=/; Max-Age=${expiresIn}`;
  }

  async getCookieWithJwtRefreshToken(email: string) {
    this.logger.info(`The user ${email} have been logged.`);
    const payload: IJwtServicePayload = { email };
    const secret = this.configService.get('APP.jwtRefreshToken');
    const expiresIn = this.configService.get('APP.jwtRefreshTokenExpiresIn');
    const token = this.jwtTokenService.createToken(payload, secret, expiresIn);
    await this.setCurrentRefreshToken(token, email);
    const cookie = `Refresh=${token}; HttpOnly; Path=/; Max-Age=${expiresIn}`;
    return cookie;
  }

  async setCurrentRefreshToken(refreshToken: string, email: string) {
    const currentHashedRefreshToken =
      await this.bcryptService.hash(refreshToken);
    await this.userService.updateRefreshToken(email, currentHashedRefreshToken);
  }

  async login(email: string, password: string): Promise<AuthResponseDto> {
    // Step 1: Fetch a user with the given email
    const user = await this.userService.getUserByEmail(email);

    // If no user is found, throw an error
    if (!user) {
      throw new NotFoundException(`No user found for email: ${email}`);
    }

    // Step 2: Check if the password is correct
    if (!user.password) {
      throw new UnauthorizedException('No password set for the user');
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);

    // If password does not match, throw an error
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid password');
    }

    // Step 3: Generate a JWT containing the user's email
    const accessToken = await this.getCookieWithJwtToken(user.email);
    const refreshToken = await this.getCookieWithJwtRefreshToken(user.email);

    // Step 4: Return the access token and refresh token in the response
    return { accessToken, refreshToken };
  }

  async signIn(email: string, password: string): Promise<AuthResponseDto> {
    // Check if user already exists
    const existingUser = await this.userService.getUserByEmail(email);
    if (existingUser) {
      throw new UnauthorizedException('User already exists');
    }

    // Step 1: Create a new user
    const newUser = await this.userService.createUser({ email, password });

    // Step 2: Generate JWT tokens for the new user
    const accessToken = await this.getCookieWithJwtToken(newUser.email);
    const refreshToken = await this.getCookieWithJwtRefreshToken(newUser.email);

    // Step 3: Return the response with tokens
    return { accessToken, refreshToken };
  }
}
