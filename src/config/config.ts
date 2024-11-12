import { registerAs } from '@nestjs/config';
import {
  AppConfig,
  DatabaseConfig,
  HttpConfig,
  LokiConfig,
  MicroserviceConfig,
} from './config.interface';
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
    jwtRefreshToken: process.env.APP_JWT_REFRESH_TOKEN || '',
    jwtRefreshTokenExpiresIn:
      process.env.APP_JWT_REFRESH_TOKEN_EXPIRES_IN || '60s',
  }),
);

const DBConfig = registerAs(
  ConfigKey.Db,
  (): DatabaseConfig => ({
    databaseUrl: process.env.DATABASE_URL || '',
  }),
);

const LokiConfig = registerAs(
  ConfigKey.Loki,
  (): LokiConfig => ({
    host: process.env.LOKI_HOST || '',
  }),
);

const HttpConfig = registerAs(
  ConfigKey.Http,
  (): HttpConfig => ({
    maxRedirects: Number(process.env.HTTP_MAX_REDIRECTS) || 5,
    timeout: Number(process.env.HTTP_TIMEOUT) || 5000,
  }),
);

const MicroserviceConfig = registerAs(
  ConfigKey.BoilerplateMicroservice,
  (): MicroserviceConfig => ({
    host: process.env.BOILERPLATE_MICROSERVICE_HOST || '',
    port: process.env.BOILERPLATE_MICROSERVICE_PORT || '',
  }),
);

export const configurations = [
  APPConfig,
  DBConfig,
  LokiConfig,
  MicroserviceConfig,
  HttpConfig,
];
