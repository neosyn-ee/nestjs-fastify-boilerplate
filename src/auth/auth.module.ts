import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { PrismaModule } from 'nestjs-prisma';
import { ConfigsModule } from 'src/config/config.module';
import { UserModule } from 'src/user/user.module';
import { UserService } from 'src/user/user.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypedConfigService } from 'src/config/typed-config.service';
import { BcryptService } from 'src/infrastructure/services/bcrypt/bcrypt.service';
import { JwtTokenService } from 'src/infrastructure/services/jwt/JwtToken.service';
import { LoggerService } from 'src/logger/logger.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [ConfigsModule, PrismaModule, PassportModule, UserModule],
  controllers: [AuthController],
  providers: [
    AuthService,
    UserService,
    TypedConfigService,
    BcryptService,
    JwtTokenService,
    LoggerService,
    JwtService,
  ],
})
export class AuthModule {}
