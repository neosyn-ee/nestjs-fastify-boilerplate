import { Module } from '@nestjs/common';
import { ExamplefeatureModule } from './examplefeature/examplefeature.module';
import { ConfigsModule } from './config/config.module';

@Module({
  imports: [ConfigsModule, ExamplefeatureModule],
})
export class AppModule {}
