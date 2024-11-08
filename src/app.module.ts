import { ClsPluginTransactional } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ClsModule } from 'nestjs-cls';
import { AuthModule } from './auth/auth.module';
import { ConfigsModule } from './config/config.module';
import { DatabaseModule } from './database/database.module';
import { DatabaseService } from './database/database.service';
import { LoggerService } from './logger/logger.service';
import { LoggingInterceptor } from './logger/logging.interceptor';
import { MetricsModule } from './metrics/metrics.module';
import { UserModule } from './user/user.module';
import { UserService } from './user/user.service';
import { BcryptModule } from './bcrypt/bcrypt.module';
import { JwtTokenModule } from './jwt/jwtToken.module';
import { CookieModule } from './cookie/cookie.module';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule } from '@nestjs/config';
import { TypedConfigService } from './config/typed-config.service';

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
    CookieModule,
    ClientsModule.registerAsync([
      {
        imports: [ConfigModule],
        name: 'BOILER_SERVICE',
        useFactory: async (configService: TypedConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: configService.get('APP.host'),
            port: configService.get('APP.port'),
          },
        }),
        inject: [TypedConfigService],
        extraProviders: [TypedConfigService],
      },
    ]),
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
