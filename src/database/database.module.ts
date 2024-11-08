import { Module } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { TypedConfigService } from 'src/config/typed-config.service';

@Module({
  exports: [DatabaseService],
  providers: [DatabaseService, TypedConfigService],
})
export class DatabaseModule {}
