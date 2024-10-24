import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { configurations } from './config';
import { validateConfig } from './config-validation';
import { TypedConfigService } from './typed-config.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [...configurations],
      envFilePath: ['.env.development', '.env.uat', '.env.production'],
      cache: true,
      validate: validateConfig,
    }),
  ],
  providers: [TypedConfigService],
  exports: [TypedConfigService],
})
export class ConfigsModule {}
