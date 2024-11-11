import { Module } from '@nestjs/common';
import { CustomHttpService } from './customHttp.service';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { TypedConfigService } from 'src/config/typed-config.service';

@Module({
  imports: [
    HttpModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: TypedConfigService) => ({
        timeout: configService.get('HTTP.timeout'),
        maxRedirects: configService.get('HTTP.maxRedirects'),
      }),
      inject: [TypedConfigService],
      extraProviders: [TypedConfigService],
    }),
  ],
  providers: [CustomHttpService, TypedConfigService],
})
export class CustomHttpModule {}
