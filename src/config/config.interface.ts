import { Environment } from './config.enum';

export interface AppConfig {
  env: Environment;
  port: number;
  name: string;
  description: string;
  version: string;
}
export interface DatabaseConfig {
  host: string;
  port: number;
  username: string;
  password: string;
  databaseName: string;
  databaseUrl: string;
}
