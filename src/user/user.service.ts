import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { UserRepository } from './user.repository';
import * as bcrypt from 'bcrypt';
import { ErrorCodes } from 'src/errors/error-codes.enum';

export const roundsOfHashing = 10;
@Injectable()
export class UserService {
  constructor(private repository: UserRepository) {}

  private async processPassword(password: string): Promise<string> {
    const trimmedPassword = password.trim();

    if (trimmedPassword === '') {
      throw new BadRequestException({
        message: 'Password cannot be empty',
        code: ErrorCodes.PASSWORD_CANNOT_BE_EMPTY,
      });
    }

    return await bcrypt.hash(trimmedPassword, roundsOfHashing);
  }

  async createUser(params: Prisma.UserCreateInput): Promise<User> {
    const { email, name } = params;
    const existingUser = await this.repository.findUserByEmail(email);

    if (existingUser) {
      throw new ConflictException({
        message: 'User with this email already exists',
        code: ErrorCodes.USER_ALREADY_EXISTS,
      });
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

  async updateRefreshToken(email: string, hashRefreshToken: string) {
    await this.repository.updateUserByEmail(email, {
      hashRefreshToken,
    });
  }
}
