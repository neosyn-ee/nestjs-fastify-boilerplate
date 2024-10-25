import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import { Injectable } from '@nestjs/common';
import { Prisma, PrismaClient, Role, User } from '@prisma/client';
import BaseAbstractRepository from 'src/database/base.abstract.repository';
import {
  DelegateArgs,
  DelegateReturnTypes,
} from 'src/database/base.type.repository';

type UserDelegate = Prisma.UserDelegate;

@Injectable()
export class UserRepository extends BaseAbstractRepository<
  UserDelegate,
  DelegateArgs<UserDelegate>,
  DelegateReturnTypes<UserDelegate>
> {
  constructor(
    protected readonly prisma: PrismaClient,
    private readonly txHost: TransactionHost<TransactionalAdapterPrisma>,
  ) {
    super(prisma.user);
  }

  /** Custom method to find users with a specific role */
  async findUsersByRole(role: Role): Promise<User[]> {
    return this.prisma.user.findMany({
      where: { role },
    });
  }

  /** Method to update a user by ID */
  async updateUserById(
    id: number,
    data: Prisma.UserUpdateInput,
  ): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data,
    });
  }

  /** Method to delete a user by ID */
  async deleteUserById(id: number): Promise<User> {
    return this.prisma.user.delete({
      where: { id },
    });
  }

  /** Method to create a new user */
  async createUser(data: Prisma.UserCreateInput): Promise<User> {
    return this.prisma.user.create({
      data,
    });
  }

  /** Method to find a unique user by ID */
  async findUserById(id: number): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  /** Method to count the total number of users */
  async countUsers(): Promise<number> {
    return this.prisma.user.count();
  }
}
