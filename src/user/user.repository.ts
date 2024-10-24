import { Injectable } from '@nestjs/common';
import { Prisma, PrismaClient, User } from '@prisma/client';
import { BaseAbstractRepository } from 'src/database/base.abstract.repository';

@Injectable()
export class UserRepository extends BaseAbstractRepository<
  User,
  Prisma.UserCreateInput
> {
  constructor(prisma: PrismaClient) {
    super(prisma);
  }

  async findUnique(id: number): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async findAll(): Promise<User[]> {
    return this.prisma.user.findMany();
  }

  async create(data: Prisma.UserCreateInput): Promise<User> {
    return this.prisma.user.create({ data });
  }

  async update(id: number, data: Partial<User>): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data,
    });
  }

  async delete(id: number): Promise<User | null> {
    return this.prisma.user.delete({
      where: { id },
    });
  }
}
