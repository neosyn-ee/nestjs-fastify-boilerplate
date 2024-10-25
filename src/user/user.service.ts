import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(private repository: UserRepository) {}

  async createUser(params: Prisma.UserCreateInput) {
    const { email, name } = params;

    const user = await this.repository.create({
      data: {
        email,
        name,
      },
    });

    return user;
  }

  async getUser(id: number) {
    const users = await this.repository.findUserById(id);
    return users;
  }
}
