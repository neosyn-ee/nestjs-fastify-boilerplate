import { Controller, Get } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from '@prisma/client';

@Controller('User')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('user')
  async getUser(): Promise<User[]> {
    return this.userService.getUsers();
  }
}
