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
  ): DottedPathToValue<EnvironmentVariables, K> | undefined {
    return this.configService.get<DottedPathToValue<EnvironmentVariables, K>>(
      key,
    );
  }
}
