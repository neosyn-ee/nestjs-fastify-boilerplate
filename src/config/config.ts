import { registerAs } from '@nestjs/config';
import { AppConfig, DatabaseConfig } from './config.interface';

export type Leaves<T> = T extends object
  ? {
      [K in keyof T]: `${Exclude<K, symbol>}${Leaves<T[K]> extends never
        ? ''
        : `.${Leaves<T[K]>}`}`;
    }[keyof T]
  : never;

export type LeafTypes<T, S extends string> = S extends `${infer T1}.${infer T2}`
  ? T1 extends keyof T
    ? LeafTypes<T[T1], T2>
    : never
  : S extends keyof T
    ? T[S]
    : never;

export enum ConfigKey {
  App = 'APP',
  Db = 'DB',
}

export enum Environment {
  Local = 'local',
  Development = 'development',
  Beta = 'beta',
  Production = 'production',
}

const APPConfig = registerAs(
  ConfigKey.App,
  (): AppConfig => ({
    env:
      Environment[process.env.NODE_ENV as keyof typeof Environment] ||
      'development',
    port: Number(process.env.APP_PORT),
    appName: process.env.APP_NAME || 'Nestjs fastify boilerplate',
  }),
);

const DBConfig = registerAs(
  ConfigKey.Db,
  (): DatabaseConfig => ({
    host: process.env.DATABASE_HOST || 'localhost',
    port: Number(process.env.DATABASE_PORT) || 5432,
    username: process.env.DATABASE_USERNAME || 'postgres',
    password: process.env.DATABASE_PASSWORD || 'postgres',
    database: process.env.DATABASE || 'postgres',
  }),
);

export const configurations = [APPConfig, DBConfig];
