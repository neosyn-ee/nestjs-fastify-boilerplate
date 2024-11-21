import {
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';

type AxiosInterceptorCallback<T> = (config: T) => T | Promise<T>;

export interface CustomAxiosRequestConfig extends AxiosRequestConfig {
  enableLogging?: boolean;
  onRequest?: AxiosInterceptorCallback<InternalAxiosRequestConfig>;
  onResponse?: AxiosInterceptorCallback<AxiosResponse>;
  onError?: AxiosInterceptorCallback<Error>;
}
