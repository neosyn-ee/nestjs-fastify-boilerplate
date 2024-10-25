import { Module } from '@nestjs/common';
import { ConfigsModule } from './config/config.module';
import { ClsModule } from 'nestjs-cls';
import { ClsPluginTransactional } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import { UserModule } from './user/user.module';
import { DatabaseModule } from './database/database.module';
import { DatabaseService } from './database/database.service';
import { UserService } from './user/user.service';

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
    UserModule,
  ],
  providers: [DatabaseService, UserService],
})
export class AppModule {}
