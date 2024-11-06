import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { PrismaModule } from 'nestjs-prisma';
import { ConfigsModule } from 'src/config/config.module';
import { TypedConfigService } from 'src/config/typed-config.service';
import { UserModule } from 'src/user/user.module';
import { UserService } from 'src/user/user.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    ConfigsModule,
    PrismaModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigsModule], // Importa ConfigModule se usi ConfigService
      inject: [TypedConfigService], // Usa il ConfigService
      useFactory: async (configService: TypedConfigService) => ({
        secret: configService.get('APP.jwt'),
        signOptions: { expiresIn: configService.get('APP.jwtExpiresIn') },
      }),
    }),
    UserModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, UserService],
})
export class AuthModule {}
