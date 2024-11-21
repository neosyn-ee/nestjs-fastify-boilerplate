import { DynamicModule, Module, Provider } from '@nestjs/common';
import { HttpModule as NestHttpModule } from '@nestjs/axios';
import { HttpService } from './http.service';
import { IHttpModuleAsyncOptions, IHttpModuleOptions } from './http.type';

/**
 * Represents a module for handling HTTP requests and responses.
 */
@Module({})
export class HttpModule {
  private static getDynamicHttpModule(option: IHttpModuleOptions) {
    const httpService = new HttpService(option);
    const providerName = option.serviceName || HttpService;
    return {
      module: HttpModule,
      providers: [
        {
          provide: providerName,
          useValue: httpService,
        },
      ],
      exports: [providerName],
    };
  }
  static forRootAsync(options: IHttpModuleAsyncOptions): DynamicModule {
    return {
      module: HttpModule,
      imports: [NestHttpModule],
      providers: [
        ...options.providers,
        {
          provide: 'HTTP_CONFIG',
          useFactory: options.useFactory,
          inject: options.inject,
        },
        {
          provide: HttpService,
          useFactory: (config: IHttpModuleOptions) => new HttpService(config),
          inject: ['HTTP_CONFIG'],
        },
      ],
      exports: [HttpService],
    };
  }

  static forFeature(
    options: IHttpModuleOptions | IHttpModuleOptions[],
  ): DynamicModule {
    if (Array.isArray(options)) {
      const providers: Provider[] = options.map((option) => {
        const httpService = new HttpService(option);
        const providerName = option.serviceName || HttpService;
        return {
          provide: providerName,
          useValue: httpService,
        };
      });

      return {
        module: HttpModule,
        imports: [NestHttpModule],
        providers,
        exports: [...providers],
      };
    } else {
      return this.getDynamicHttpModule(options);
    }
  }

  static forRoot(config: IHttpModuleOptions): DynamicModule {
    const httpService = new HttpService(config);

    return {
      global: true,
      module: HttpModule,
      imports: [NestHttpModule],
      providers: [
        {
          provide: HttpService,
          useValue: httpService,
        },
      ],
      exports: [HttpService],
    };
  }
  static forFeatureWithProvider(options: IHttpModuleOptions): {
    module: DynamicModule;
    provider: Provider;
  } {
    const httpService = new HttpService(options);
    const providerName = options.serviceName;

    if (!providerName) throw new Error('provider name is undefined');
    const provider = {
      provide: providerName,
      useValue: httpService,
    } as Provider;
    return {
      module: {
        module: HttpModule,
        providers: [provider],
        exports: [providerName, HttpModule],
      },
      provider,
    };
  }
}
