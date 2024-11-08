import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { PrismaModule } from 'nestjs-prisma';
import { ConfigsModule } from 'src/config/config.module';
import { UserModule } from 'src/user/user.module';
import { UserService } from 'src/user/user.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypedConfigService } from 'src/config/typed-config.service';
import { BcryptService } from 'src/bcrypt/bcrypt.service';
import { JwtTokenService } from 'src/jwt/jwtToken.service';
import { LoggerService } from 'src/logger/logger.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { JwtRefreshTokenStrategy } from 'src/jwt/guard/jwtRefresh.strategy';
import { JwtStrategy } from 'src/jwt/guard/jwt.strategy';
import { CookieService } from 'src/cookie/cookie.service';

@Module({
  imports: [
    ConfigsModule,
    PrismaModule,
    PassportModule,
    UserModule,
    JwtModule.registerAsync({
      imports: [ConfigsModule],
      inject: [TypedConfigService],
      useFactory: async (configService: TypedConfigService) => ({
        secret: configService.get('APP.jwt'),
        signOptions: { expiresIn: configService.get('APP.jwtExpiresIn') },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    UserService,
    TypedConfigService,
    BcryptService,
    JwtTokenService,
    LoggerService,
    JwtService,
    JwtStrategy,
    JwtRefreshTokenStrategy,
    CookieService,
  ],
})
export class AuthModule {}
