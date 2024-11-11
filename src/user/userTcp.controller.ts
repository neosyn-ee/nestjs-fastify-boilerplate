import { Controller, UseGuards } from '@nestjs/common';
import { JwtGuard } from 'src/jwt/guard/jwtAuth.guard';
import { UserService } from './user.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { User } from '@prisma/client';

@Controller('user')
@UseGuards(JwtGuard)
export class UserTcpController {
  constructor(private readonly userService: UserService) {}

  @MessagePattern({ cmd: 'get-user-by-email' })
  async getUserByEmail(@Payload() email: string): Promise<User | null> {
    return this.userService.getUserByEmail(email);
  }
}
