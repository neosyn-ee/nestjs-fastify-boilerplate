import { Module } from '@nestjs/common';
import { ExamplefeatureModule } from './examplefeature/examplefeature.module';

@Module({
  imports: [ExamplefeatureModule]
})
export class AppModule {}
