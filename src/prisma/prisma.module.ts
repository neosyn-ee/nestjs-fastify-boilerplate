import { Module } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';

@Module({
  exports: [PrismaService],
  providers: [PrismaService],
})
export class PrismaModule {}
