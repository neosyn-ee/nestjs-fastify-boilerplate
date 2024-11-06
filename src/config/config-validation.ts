import { plainToClass } from 'class-transformer';
import {
  IsDefined,
  IsEnum,
  IsNumberString,
  IsString,
  MinLength,
  validateSync,
} from 'class-validator';
import { Environment } from './config.enum';

class EnvironmentVariables {
  /* APP CONFIG */
  @IsDefined()
  @IsEnum(Environment)
  NODE_ENV: Environment;

  @IsDefined()
  @IsNumberString()
  @MinLength(1)
  APP_PORT: string;

  @IsDefined()
  @IsString()
  @MinLength(1)
  APP_NAME: string;

  /* DATA CONFIG */
  @IsDefined()
  @IsString()
  @MinLength(1)
  DATABASE_URL: string;

  @IsDefined()
  @IsString()
  @MinLength(1)
  APP_DESCRIPTION: string;

  @IsDefined()
  @IsString()
  @MinLength(1)
  APP_VERSION: string;

  @IsDefined()
  @IsString()
  @MinLength(1)
  APP_HOST: string;

  @IsDefined()
  @IsString()
  @MinLength(1)
  APP_JWT: string;

  @IsDefined()
  @IsString()
  @MinLength(1)
  APP_JWT_EXPIRES_IN: string;

  @IsDefined()
  @IsString()
  @MinLength(1)
  APP_JWT_REFRESH_TOKEN: string;

  @IsDefined()
  @IsString()
  @MinLength(1)
  APP_JWT_REFRESH_TOKEN_EXPIRES_IN: string;
}

export function validateConfig(configuration: Record<string, unknown>) {
  const finalConfig = plainToClass(EnvironmentVariables, configuration, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(finalConfig, { skipMissingProperties: false });

  let index = 0;
  for (const err of errors) {
    Object.values(err.constraints ?? []).map((str) => {
      ++index;
      console.log(index, str);
    });
    console.log('\n ***** \n');
  }
  if (errors.length) throw new Error(`Please provide the valid ENVs ${errors}`);

  return finalConfig;
}
