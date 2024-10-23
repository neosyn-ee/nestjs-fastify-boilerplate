import { Environment } from './config';

export interface AppConfig {
  env: Environment;
  port: number;
  appName: string;
}
export interface DatabaseConfig {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
}

export type EnvironmentVariables = AppConfig & DatabaseConfig;
