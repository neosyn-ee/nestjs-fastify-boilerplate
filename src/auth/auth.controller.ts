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
    description:
      'Allows a user to log in by providing their credentials (email and password). Upon successful login, the user receives an access token that grants access to protected resources. This access token should be included in the Authorization header of subsequent requests to authenticate the user.',
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
    description:
      'Allows a user to sign in by providing their credentials (email and password). Upon successful authentication, the user receives an access token and a refresh token. The access token grants access to protected resources, while the refresh token can be used to obtain a new access token without re-authenticating.',
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
  async signIn(
    @Body() { email, password }: CreateUserDto,
    @Res({ passthrough: true }) reply: FastifyReply,
  ) {
    const { accessToken, refreshToken } = await this.authService.signIn(
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

  @Post('refresh')
  @ApiOperation({
    summary: 'User refresh token',
    description:
      'Allows a user to use their refresh token to obtain a new access token. The refresh token must be valid and unexpired. This operation helps maintain user sessions without requiring reauthentication, improving the user experience for long-lived sessions.',
  })
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

  @Post('logout')
  @ApiOperation({
    summary: 'User logout',
    description:
      'Allows a user to log out by invalidating their session. This operation clears the access and refresh tokens, ensuring the user can no longer access protected resources until they authenticate again. The tokens are removed from the client, preventing unauthorized use.',
  })
  @UseGuards(JwtGuard)
  @ApiCookieAuth()
  async logout(@Res() res: FastifyReply) {
    res.clearCookie(CookieNames.AccessToken);
    res.clearCookie(CookieNames.RefreshToken);

    return res.send({ message: 'Logout effettuato con successo' });
  }
}
