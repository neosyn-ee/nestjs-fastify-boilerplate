import { type PrismaClient } from '@prisma/client';
import * as runtime from '@prisma/client/runtime/library.js';
import { IBaseRepository } from './base.interface.repository';

export abstract class BaseAbstractRepository<
  T extends runtime.Types.Result.DefaultSelection<runtime.OperationPayload>,
  U,
> implements IBaseRepository<T, U>
{
  protected constructor(protected readonly prisma: PrismaClient) {}

  abstract findUnique(id: number): Promise<T | null>;

  abstract findAll(): Promise<T[]>;

  abstract create(data: U): Promise<U>;

  abstract update(id: number, data: Partial<T>): Promise<T>;

  abstract delete(id: number): Promise<T | null>;
}
