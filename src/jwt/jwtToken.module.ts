import { Module } from '@nestjs/common';
import { JwtTokenService } from './jwtToken.service';
import { JwtService } from '@nestjs/jwt';
import { TypedConfigService } from 'src/config/typed-config.service';
import { LoggerService } from 'src/logger/logger.service';

@Module({
  providers: [JwtTokenService, JwtService, TypedConfigService, LoggerService],
})
export class JwtTokenModule {}
