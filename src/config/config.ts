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
    name: process.env.APP_NAME || 'Nestjs fastify boilerplate',
    description: process.env.APP_DESCRIPTION || 'Nestjs fastify boilerplate',
    version: process.env.APP_VERSION || '1.0',
    host: process.env.APP_URL || 'localhost',
    jwt: process.env.APP_JWT || '',
    jwtExpiresIn: process.env.APP_JWT_EXPIRES_IN || '60s',
  }),
);

const DBConfig = registerAs(
  ConfigKey.Db,
  (): DatabaseConfig => ({
    databaseUrl: process.env.DATABASE_URL || '',
  }),
);

export const configurations = [APPConfig, DBConfig];
