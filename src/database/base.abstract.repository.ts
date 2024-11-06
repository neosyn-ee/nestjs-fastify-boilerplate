import { LoggerService } from 'src/logger/logger.service';

type Operation =
  | 'findFirst'
  | 'findUnique'
  | 'findMany'
  | 'create'
  | 'createMany'
  | 'update'
  | 'updateMany'
  | 'delete'
  | 'deleteMany'
  | 'count';

abstract class BaseAbstractRepository<
  Db extends { [Key in Operation]: (data: any) => unknown },
  Args extends { [K in Operation]: unknown },
  Return extends { [K in Operation]: unknown },
> {
  constructor(
    protected db: Db,
    protected logger: LoggerService,
  ) {}

  private handleException<T>(operation: () => T): T | null {
    try {
      return operation();
    } catch (error) {
      this.logger.error(error);
      return null;
    }
  }

  findFirst(data?: Args['findFirst']): Return['findFirst'] {
    return this.handleException(() => this.db.findFirst(data));
  }

  findUnique(data: Args['findUnique']): Return['findUnique'] {
    return this.handleException(() => this.db.findUnique(data));
  }

  findMany(data?: Args['findMany']): Return['findMany'] {
    return this.handleException(() => this.db.findMany(data));
  }

  create(data: Args['create']): Return['create'] {
    return this.handleException(() => this.db.create(data));
  }

  createMany(data: Args['createMany']): Return['createMany'] {
    return this.handleException(() => this.db.createMany(data));
  }

  update(data: Args['update']): Return['update'] {
    return this.handleException(() => this.db.update(data));
  }

  updateMany(data: Args['updateMany']): Return['updateMany'] {
    return this.handleException(() => this.db.updateMany(data));
  }

  delete(data: Args['delete']): Return['delete'] {
    return this.handleException(() => this.db.delete(data));
  }

  deleteMany(data?: Args['deleteMany']): Return['deleteMany'] {
    return this.handleException(() => this.db.deleteMany(data));
  }

  count(data?: Args['count']): Return['count'] {
    return this.handleException(() => this.db.count(data));
  }
}

export default BaseAbstractRepository;
