import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AuthResponseDto, LoginDto } from './dto/login.dto';
import { CreateUserDto } from 'src/user/dto/create-user.dto';

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
  login(@Body() { email, password }: LoginDto) {
    return this.authService.login(email, password);
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
}
