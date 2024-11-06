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
}
export interface DatabaseConfig {
  databaseUrl: string;
}
