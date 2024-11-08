import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBody,
  ApiCookieAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { FastifyReply } from 'fastify';
import { CookieNames } from 'src/cookie/cookie-names.enum';
import { CookieService } from 'src/cookie/cookie.service';
import { JwtGuard } from 'src/jwt/guard/jwtAuth.guard';
import JwtRefreshGuard from 'src/jwt/guard/jwtRefresh.guard';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { IsAuthPresenter } from './auth.presenter';
import { AuthService } from './auth.service';
import { AuthResponseDto, LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { ErrorCodes } from 'src/errors/error-codes.enum';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly cookieService: CookieService,
  ) {}

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

    this.cookieService.setCookie(reply, CookieNames.AccessToken, accessToken);
    this.cookieService.setCookie(reply, CookieNames.RefreshToken, refreshToken);

    reply.send({ message: 'Login successful' });
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

    this.cookieService.setCookie(reply, CookieNames.AccessToken, accessToken);
    this.cookieService.setCookie(reply, CookieNames.RefreshToken, refreshToken);

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
    @Body() { email }: RefreshTokenDto,
    @Res({ passthrough: true }) reply: FastifyReply,
  ) {
    const { accessToken, refreshToken } =
      await this.authService.generateAuthCookies(email);
    this.cookieService.setCookie(reply, CookieNames.AccessToken, accessToken);
    this.cookieService.setCookie(reply, CookieNames.RefreshToken, refreshToken);

    reply.send({ message: 'Refresh successful' });
  }

  @Get('is_authenticated')
  @ApiCookieAuth()
  @UseGuards(JwtGuard)
  @ApiOperation({
    summary: 'User is authenticated',
    description:
      'Checks if the user is authenticated using a JWT token. This endpoint requires an email as a query parameter to identify the user and verify their authentication status. Returns user details if authenticated; otherwise, throws a 401 Unauthorized error.',
  })
  @ApiQuery({
    name: 'email',
    type: String,
    required: true,
    description: 'User email to be verified',
    example: 'john.doe@example.com',
  })
  async isAuthenticated(@Query('email') email: string) {
    const user = await this.authService.execute(email);
    if (!user) {
      throw new UnauthorizedException({
        message: 'User not authenticated',
        code: ErrorCodes.UNAUTHORIZED,
      });
    }

    const response = new IsAuthPresenter();
    response.email = user.email;
    return response;
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
