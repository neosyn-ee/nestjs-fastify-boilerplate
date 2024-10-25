import { Module } from '@nestjs/common';
import { ExamplefeatureModule } from './examplefeature/examplefeature.module';
import { LoggerService } from './logger/logger.service';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { LoggingInterceptor } from './logger/logging.interceptor';
import { MetricsModule } from './metrics/metrics.module';

@Module({
  imports: [ExamplefeatureModule, MetricsModule],
  providers: [
    LoggerService,
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
})
export class AppModule {}
