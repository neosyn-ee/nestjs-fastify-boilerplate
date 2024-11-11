import { ConfigKey } from './config.enum';
import {
  AppConfig,
  DatabaseConfig,
  LokiConfig,
  MicroserviceConfig,
} from './config.interface';

type Join<T extends string[], D extends string> = T extends []
  ? never
  : T extends [infer F]
    ? F
    : T extends [infer F, ...infer R]
      ? F extends string
        ? `${F}${D}${Join<Extract<R, string[]>, D>}`
        : never
      : string;

type PathsToStringProps<T> = T extends string | number
  ? []
  : {
      [K in Extract<keyof T, string>]: [K, ...PathsToStringProps<T[K]>];
    }[Extract<keyof T, string>];

export type DottedPathToValue<
  T,
  K extends string,
> = K extends `${infer P}.${infer Rest}`
  ? P extends keyof T
    ? DottedPathToValue<T[P], Rest>
    : never
  : K extends keyof T
    ? T[K]
    : never;

export type EnvironmentVariables = Record<ConfigKey.App, AppConfig> &
  Record<ConfigKey.Db, DatabaseConfig> &
  Record<ConfigKey.Loki, LokiConfig> &
  Record<ConfigKey.BoilerplateMicroservice, MicroserviceConfig>;

export type DottedLanguageObjectStringPaths = Join<
  PathsToStringProps<EnvironmentVariables>,
  '.'
>;
