import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(private repository: UserRepository) {}

  async createUser(params: Prisma.UserCreateInput) {
    const { email, name } = params;

    const user = await this.repository.create({
      email,
      name,
    });

    return user;
  }

  async getUsers() {
    const users = await this.repository.findAll();
    return users;
  }
}
