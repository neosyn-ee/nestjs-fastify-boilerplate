import { Module } from '@nestjs/common';
import { JwtTokenService } from './JwtToken.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  providers: [JwtTokenService, JwtService],
})
export class JwtTokenModule {}
