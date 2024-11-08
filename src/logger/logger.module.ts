import { Module } from '@nestjs/common';
import { LoggerService } from './logger.service';
import { TypedConfigService } from 'src/config/typed-config.service';

@Module({
  providers: [LoggerService, TypedConfigService],
  exports: [LoggerService],
})
export class LoggerModule {}
