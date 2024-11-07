import { Body, Controller, Post, Res, UseGuards } from '@nestjs/common';
import {
  ApiBody,
  ApiCookieAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { FastifyReply } from 'fastify';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { AuthService } from './auth.service';
import { CookieNames } from './cookie-names.enum';
import {
  AuthRefreshTokenDto,
  AuthResponseDto,
  LoginDto,
} from './dto/login.dto';
import { JwtGuard } from './jwtAuth.guard';
import JwtRefreshGuard from './jwtRefresh.guard';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({
    summary: 'User login',
    description: 'Allows a user to log in and receive an access token.',
  })
  @ApiResponse({
    status: 201,
    description: 'User access token is created',
    type: AuthResponseDto,
  })
  @ApiResponse({ status: 404, description: 'User not found.' })
  async login(
    @Body() { email, password }: LoginDto,
    @Res({ passthrough: true }) reply: FastifyReply,
  ) {
    const { accessToken, refreshToken } = await this.authService.login(
      email,
      password,
    );

    reply.setCookie(CookieNames.AccessToken, accessToken, {
      httpOnly: true,
      secure: false,
      expires: new Date(Date.now() + 1 * 24 * 60 * 1000),
      path: '/',
      sameSite: 'lax',
    });

    reply.setCookie(CookieNames.RefreshToken, refreshToken, {
      httpOnly: true,
      secure: false,
      expires: new Date(Date.now() + 1 * 24 * 60 * 1000),
      path: '/',
      sameSite: 'lax',
    });

    reply.send({ accessToken, refreshToken });
  }

  @Post('signIn')
  @ApiOperation({
    summary: 'User sign in',
    description: 'Allows a user to sign in and receive an access token.',
  })
  @ApiBody({
    description: 'User sign in credentials',
    type: CreateUserDto,
    required: true,
  })
  @ApiResponse({
    status: 201,
    description: 'User access token is created',
    type: AuthResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid password or unauthorized access',
  })
  signIn(@Body() { email, password }: CreateUserDto) {
    return this.authService.signIn(email, password);
  }

  @Post('refresh')
  @UseGuards(JwtRefreshGuard)
  async refresh(
    @Body() { email }: AuthRefreshTokenDto,
    @Res({ passthrough: true }) reply: FastifyReply,
  ) {
    const accessTokenCookie =
      await this.authService.createAccessJwtToken(email);

    reply.setCookie('access_token', accessTokenCookie, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      path: '/',
      maxAge: 3600 * 24,
    });
    reply.send({ message: 'Refresh successful' });
  }

  @UseGuards(JwtGuard)
  @Post('logout')
  @ApiCookieAuth()
  async logout(@Res() res: FastifyReply) {
    res.clearCookie(CookieNames.AccessToken);
    res.clearCookie(CookieNames.RefreshToken);

    return res.send({ message: 'Logout effettuato con successo' });
  }
}
