import { Environment } from './config.enum';

export interface AppConfig {
  env: Environment;
  port: number;
  name: string;
  description: string;
  version: string;
  host: string;
  jwt: string;
  jwtExpiresIn: string;
  jwtRefreshToken: string;
  jwtRefreshTokenExpiresIn: string;
}
export interface DatabaseConfig {
  databaseUrl: string;
}
export interface LokiConfig {
  host: string;
}
