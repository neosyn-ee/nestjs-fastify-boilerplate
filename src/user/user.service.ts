import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { UserRepository } from './user.repository';
import * as bcrypt from 'bcrypt';

export const roundsOfHashing = 10;
@Injectable()
export class UserService {
  constructor(private repository: UserRepository) {}

  private async processPassword(password: string): Promise<string> {
    const trimmedPassword = password.trim();

    if (trimmedPassword === '') {
      throw new BadRequestException('Password cannot be empty');
    }

    return await bcrypt.hash(trimmedPassword, roundsOfHashing);
  }

  async createUser(params: Prisma.UserCreateInput): Promise<User> {
    const { email, name } = params;

    // Step 1: Check if the user already exists by email
    const existingUser = await this.repository.findUserByEmail(email);

    // If the user exists, throw an error
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const hashedPassword = await this.processPassword(params.password ?? '');

    const user = await this.repository.create({
      data: {
        email,
        name,
        password: hashedPassword,
      },
    });

    return user;
  }

  async getUser(id: number): Promise<User | null> {
    const users = await this.repository.findUserById(id);
    return users;
  }

  async getUserByEmail(email: string): Promise<User | null> {
    const users = await this.repository.findUserByEmail(email);
    return users;
  }

  async getAllUsers(): Promise<User[]> {
    return this.repository.findAll();
  }

  async updateUser(id: number, data: Prisma.UserUpdateInput): Promise<User> {
    if (data.password && typeof data.password === 'string') {
      const hashedPassword = await this.processPassword(data.password ?? '');

      return this.repository.updateUserById(id, {
        ...data,
        password: hashedPassword,
      });
    }
    return this.repository.updateUserById(id, data);
  }

  async deleteUser(id: number): Promise<void> {
    await this.repository.deleteUserById(id);
  }
}
