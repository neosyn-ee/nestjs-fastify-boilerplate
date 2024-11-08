import * as runtime from '@prisma/client/runtime/library.js';

export interface IBaseRepository<
  T extends runtime.Types.Result.DefaultSelection<runtime.OperationPayload>,
  U,
> {
  findUnique(id: number): Promise<T | null>;

  findAll(): Promise<T[]>;

  create(data: U): Promise<U>;

  update(id: number, data: Partial<T>): Promise<T>;

  delete(id: number): Promise<T | null>;
}
