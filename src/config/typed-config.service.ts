import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import {
  DottedLanguageObjectStringPaths,
  DottedPathToValue,
  EnvironmentVariables,
} from './config.type';

@Injectable()
export class TypedConfigService {
  constructor(private configService: ConfigService) {}

  get<K extends DottedLanguageObjectStringPaths>(
    key: K,
    defaultValue?: DottedPathToValue<EnvironmentVariables, K>,
  ): DottedPathToValue<EnvironmentVariables, K> {
    const value =
      this.configService.get<DottedPathToValue<EnvironmentVariables, K>>(key);

    if (value === undefined) {
      if (defaultValue !== undefined) {
        return defaultValue;
      } else {
        throw new Error(`Configuration key "${key}" is missing`);
      }
    }

    return value;
  }
}
