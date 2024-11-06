import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { AuthResponseDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService,
  ) {}

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

    // Step 3: Generate a JWT containing the user's ID and return it
    return {
      accessToken: this.jwtService.sign({ userId: user.id }),
    };
  }

  async signIn(email: string, password: string): Promise<AuthResponseDto> {
    const newUser = await this.userService.createUser({ email, password });

    const payload = { userId: newUser.id, email: newUser.email };
    const accessToken = this.jwtService.sign(payload);

    return { accessToken };
  }
}
