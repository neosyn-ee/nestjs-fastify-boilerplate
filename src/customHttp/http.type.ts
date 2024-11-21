import { Logger } from '@nestjs/common';
import { CustomAxiosRequestConfig } from './axios.interface';

export type IHttpModuleAsyncOptions = {
  useFactory: (
    ...args: any[]
  ) => IHttpModuleOptions | Promise<IHttpModuleOptions>;
  inject?: any[];
  providers: any[];
};

export type IHttpModuleOptions = {
  serviceName?: string;
  logger?: Logger;
  config: CustomAxiosRequestConfig;
};
