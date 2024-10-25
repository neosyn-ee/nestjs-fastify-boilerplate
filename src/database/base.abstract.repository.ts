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
  constructor(protected db: Db) {}

  //TODO: add private handleException with extension-methods

  findFirst(data?: Args['findFirst']): Return['findFirst'] {
    return this.db.findFirst(data);
  }

  findUnique(data: Args['findUnique']): Return['findUnique'] {
    return this.db.findUnique(data);
  }

  findMany(data?: Args['findMany']): Return['findMany'] {
    return this.db.findMany(data);
  }

  create(data: Args['create']): Return['create'] {
    return this.db.create(data);
  }

  createMany(data: Args['createMany']): Return['createMany'] {
    return this.db.createMany(data);
  }

  update(data: Args['update']): Return['update'] {
    return this.db.update(data);
  }

  updateMany(data: Args['updateMany']): Return['updateMany'] {
    return this.db.updateMany(data);
  }

  delete(data: Args['delete']): Return['delete'] {
    return this.db.delete(data);
  }

  deleteMany(data?: Args['deleteMany']): Return['deleteMany'] {
    return this.db.deleteMany(data);
  }

  count(data?: Args['count']): Return['count'] {
    return this.db.count(data);
  }
}

export default BaseAbstractRepository;
