import { registerAs } from '@nestjs/config';
import { AppConfig, DatabaseConfig } from './config.interface';
import { ConfigKey, Environment } from './config.enum';

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
    databaseUrl: process.env.DATABASE_URL || '',
  }),
);

export const configurations = [APPConfig, DBConfig];
