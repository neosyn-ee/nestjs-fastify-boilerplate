import { Module } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { UserController } from './user.controller';
import { UserRepository } from './user.repository';
import { UserService } from './user.service';
import { LoggerModule } from 'src/logger/logger.module';

@Module({
  imports: [LoggerModule],
  controllers: [UserController],
  providers: [PrismaClient, UserService, UserRepository],
  exports: [UserRepository, UserService],
})
export class UserModule {}
