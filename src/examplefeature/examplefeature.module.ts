import { Module } from '@nestjs/common';
import { ExamplefeatureController } from './examplefeature.controller';
import { ExampleFeatureService } from './examplefeature.service';
import { LoggerService } from 'src/logger/logger.service';

@Module({
  imports: [],
  controllers: [ExamplefeatureController],
  providers: [ExampleFeatureService,LoggerService],
})
export class ExamplefeatureModule {}
