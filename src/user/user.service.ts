import { Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(private repository: UserRepository) {}

  async createUser(params: Prisma.UserCreateInput): Promise<User> {
    const { email, name } = params;

    const user = await this.repository.create({
      data: {
        email,
        name,
      },
    });

    return user;
  }

  async getUser(id: number): Promise<User | null> {
    const users = await this.repository.findUserById(id);
    return users;
  }

  async getAllUsers(): Promise<User[]> {
    return this.repository.findAll();
  }

  async updateUser(id: number, data: Prisma.UserUpdateInput): Promise<User> {
    return this.repository.updateUserById(id, data);
  }

  async deleteUser(id: number): Promise<void> {
    await this.repository.deleteUserById(id);
  }
}
