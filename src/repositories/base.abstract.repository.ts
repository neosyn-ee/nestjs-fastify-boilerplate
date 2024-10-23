import { Prisma, PrismaClient } from '@prisma/client';
import { BaseInterfaceRepository } from './base.interface.repository';

export abstract class BaseAbstractRepository<T, CreateInput>
  implements BaseInterfaceRepository<T, CreateInput>
{
  protected readonly prisma: PrismaClient;
  protected modelName: T; // What type should I use?

  protected constructor(prisma: PrismaClient, modelName: T) {
    this.prisma = prisma;
    this.modelName = modelName;
  }

  public async create(
    data: CreateInput,
    transaction?: Prisma.TransactionClient,
  ): Promise<T> {
    try {
      if (transaction) {
        return await transaction[this.modelName].create({ data });
      }
      return await this.modelName.create({ data });
    } catch (error) {
      throw new Error(`Failed to create entity: ${error.message}`);
    }
  }

  public async findOneById(
    id: number,
    transaction?: Prisma.TransactionClient,
  ): Promise<T | null> {
    try {
      if (transaction) {
        return await transaction[this.modelName].findUnique({ where: { id } });
      }
      return await this.modelName.findUnique({ where: { id } });
    } catch (error) {
      throw new Error(`Failed to find entity with id ${id}: ${error.message}`);
    }
  }

  public async remove(
    id: number,
    transaction?: Prisma.TransactionClient,
  ): Promise<T> {
    try {
      if (transaction) {
        return await transaction[this.modelName].delete({ where: { id } });
      }
      return await this.modelName.delete({ where: { id } });
    } catch (error) {
      throw new Error(
        `Failed to remove entity with id ${id}: ${error.message}`,
      );
    }
  }

  public async findByCondition(filterCondition: Partial<T>): Promise<T | null> {
    try {
      return await this.modelName.findFirst({ where: filterCondition });
    } catch (error) {
      throw new Error(`Failed to find entity by condition: ${error.message}`);
    }
  }
  public async findAll(): Promise<T[]> {
    try {
      return await this.modelName.findMany();
    } catch (error) {
      throw new Error(`Failed to find all entities: ${error.message}`);
    }
  }
  public async findWithRelations(relations: any): Promise<T[]> {
    try {
      return await this.modelName.findMany({ include: relations });
    } catch (error) {
      throw new Error(
        `Failed to find entities with relations: ${error.message}`,
      );
    }
  }
  public async update(id: number, data: Partial<T>): Promise<T | null> {
    try {
      return await this.modelName.update({
        where: { id },
        data,
      });
    } catch (error) {
      throw new Error(
        `Failed to update entity with id ${id}: ${error.message}`,
      );
    }
  }
}
