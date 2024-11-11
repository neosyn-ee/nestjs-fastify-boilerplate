import { HttpModuleOptions, HttpModuleOptionsFactory } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { TypedConfigService } from 'src/config/typed-config.service';

@Injectable()
export class CustomHttpService implements HttpModuleOptionsFactory {
  constructor(private readonly configService: TypedConfigService) {}

  createHttpOptions(): HttpModuleOptions {
    return {
      timeout: this.configService.get('HTTP.timeout'),
      maxRedirects: this.configService.get('HTTP.maxRedirects'),
    };
  }
}
