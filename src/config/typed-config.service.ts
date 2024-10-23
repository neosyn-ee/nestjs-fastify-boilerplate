import { ConfigService } from '@nestjs/config';
import { LeafTypes, Leaves } from './config';
import { EnvironmentVariables } from './config.interface';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TypedConfigService {
  constructor(private configService: ConfigService) {}

  get<T extends Leaves<EnvironmentVariables>>(
    propertyPath: T,
  ): LeafTypes<EnvironmentVariables, T> | undefined {
    return this.configService.get(propertyPath);
  }
}
