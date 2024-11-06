import { ClsPluginTransactional } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ClsModule } from 'nestjs-cls';
import { AuthModule } from './auth/auth.module';
import { ConfigsModule } from './config/config.module';
import { DatabaseModule } from './database/database.module';
import { DatabaseService } from './database/database.service';
import { BcryptModule } from './infrastructure/services/bcrypt/bcrypt.module';
import { LoggerService } from './logger/logger.service';
import { LoggingInterceptor } from './logger/logging.interceptor';
import { MetricsModule } from './metrics/metrics.module';
import { UserModule } from './user/user.module';
import { UserService } from './user/user.service';
import { JwtTokenModule } from './infrastructure/services/jwt/jwtToken.module';

@Module({
  imports: [
    ConfigsModule,
    ClsModule.forRoot({
      plugins: [
        new ClsPluginTransactional({
          imports: [
            // module in which the PrismaClient is provided
            DatabaseModule,
          ],
          adapter: new TransactionalAdapterPrisma({
            // the injection token of the PrismaClient
            prismaInjectionToken: DatabaseService,
          }),
        }),
      ],
      global: true,
      middleware: { mount: true },
    }),
    AuthModule,
    UserModule,
    MetricsModule,
    BcryptModule,
    JwtTokenModule,
  ],
  providers: [
    DatabaseService,
    UserService,
    LoggerService,
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
})
export class AppModule {}
