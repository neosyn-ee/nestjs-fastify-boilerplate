import { Module } from '@nestjs/common';
import { ExamplefeatureController } from './examplefeature.controller';
import { ExamplefeatureService } from './examplefeature.service';

@Module({
  imports: [],
  controllers: [ExamplefeatureController],
  providers: [ExamplefeatureService],
})
export class ExamplefeatureModule {}
