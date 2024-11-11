import { Module } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { UserController } from './user.controller';
import { UserRepository } from './user.repository';
import { UserService } from './user.service';
import { LoggerModule } from 'src/logger/logger.module';
import { JwtService } from '@nestjs/jwt';
import { UserTcpController } from './userTcp.controller';

@Module({
  imports: [LoggerModule],
  controllers: [UserController, UserTcpController],
  providers: [PrismaClient, UserService, UserRepository, JwtService],
  exports: [UserRepository, UserService],
})
export class UserModule {}
