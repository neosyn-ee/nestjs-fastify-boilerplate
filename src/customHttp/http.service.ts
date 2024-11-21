import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { IHttpModuleOptions } from './http.type';
import { ErrorCodes } from '@neosyn-ee/event-management-type-nestjs';

@Injectable()
export class HttpService {
  private axiosInstance: AxiosInstance;
  logger: Logger;

  /**
   * Creates an instance of HttpService.
   * @param options - The options for the HttpService.
   */
  constructor(options: IHttpModuleOptions) {
    const { logger, serviceName, config } = options;
    const { enableLogging, ...axiosOptions } = config;
    this.axiosInstance = axios.create(axiosOptions);
    if (enableLogging) {
      this.axiosInstance.interceptors.request.use(
        axiosOptions.onRequest || this.handleRequest.bind(this),
      );
      this.axiosInstance.interceptors.response.use(
        axiosOptions.onResponse || this.handleResponse.bind(this),
        axiosOptions.onError || this.handleErrorResponse.bind(this),
      );
    }
    if (logger) {
      this.logger = logger;
    } else {
      this.logger = new Logger(serviceName || HttpService.name);
    }
  }

  /**
   * Handles Axios errors by throwing the appropriate HttpException.
   * @param error - The Axios error.
   * @returns A rejected Promise with the appropriate HttpException.
   */
  private handleHttpError<R>(error: any): Promise<R> {
    /**
     * Handle the error appropriately.
     */
    if (error.response) {
      /**
       * If there is a response (server-side error, 4xx or 5xx).
       * Throw an HttpException with the status code and message from the response.
       */
      throw new HttpException(error.response.data, error.response.status);
    } else if (error.request) {
      /**
       * If there is no response (network error or timeout).
       * Throw a new HttpException indicating network failure or timeout.
       */
      throw new HttpException(
        {
          message: 'Network Error or Timeout',
          code: ErrorCodes.NETWORK_ERROR,
        },
        HttpStatus.SERVICE_UNAVAILABLE, // 503 Service Unavailable
      );
    } else {
      /**
       * If an error occurred during the request setup (config error).
       * Throw an HttpException with an internal server error status.
       */
      throw new HttpException(
        {
          message: error.message,
          code: ErrorCodes.REQUEST_SETUP_ERROR,
        },
        HttpStatus.INTERNAL_SERVER_ERROR, // 500 Internal Server Error
      );
    }
  }

  /**
   * Handles the HTTP request before it is sent.
   * @param config - The Axios request config.
   * @returns The modified Axios request config.
   */
  private handleRequest(
    config: InternalAxiosRequestConfig,
  ): InternalAxiosRequestConfig {
    this.logger.log(
      `HTTP Request: ${config.method?.toUpperCase()} ${config.baseURL}${
        config.url
      }`,
    );
    return config;
  }

  /**
   * Handles the HTTP response after it is received.
   * @param response - The Axios response.
   * @returns The modified Axios response.
   */
  private handleResponse(response: AxiosResponse): AxiosResponse {
    this.logger.log(
      `HTTP Response: ${
        response.status
      } ${response.config.method?.toUpperCase()} ${response.config.baseURL}${
        response.config.url
      }`,
    );
    return response;
  }

  /**
   * Handles the HTTP error response.
   * @param error - The Axios error.
   * @returns A rejected Promise with the Axios error.
   */
  private handleErrorResponse(error: AxiosError): Promise<AxiosError> {
    this.logger.error(`HTTP Error: ${error.message}`, error.stack);
    return Promise.reject(error);
  }

  /**
   * Sends an HTTP GET request.
   * @param url - The URL for the request.
   * @param config - The Axios request config.
   * @returns A Promise that resolves to the Axios response.
   */
  async get<T = any, R = AxiosResponse<T>, D = any>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<R> {
    try {
      /**
       * Make the GET request and return the response.
       */
      return await this.axiosInstance.get<T, R, D>(url, config);
    } catch (error) {
      return this.handleHttpError(error);
    }
  }

  /**
   * Sends an HTTP POST request.
   * @param url - The URL for the request.
   * @param data - The data to send in the request body.
   * @param config - The Axios request config.
   * @returns A Promise that resolves to the Axios response.
   */
  async post<T = any, R = AxiosResponse<T>, D = any>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig<D>,
  ): Promise<R> {
    try {
      return this.axiosInstance.post<T, R, D>(url, data, config);
    } catch (error) {
      return this.handleHttpError(error);
    }
  }

  /**
   * Sends an HTTP PUT request.
   * @param url - The URL for the request.
   * @param data - The data to send in the request body.
   * @param config - The Axios request config.
   * @returns A Promise that resolves to the Axios response.
   */
  async put<T = any, R = AxiosResponse<T>, D = any>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig<D>,
  ): Promise<R> {
    try {
      return this.axiosInstance.put<T, R, D>(url, data, config);
    } catch (error) {
      return this.handleHttpError(error);
    }
  }

  /**
   * Sends an HTTP PATCH request.
   * @param url - The URL for the request.
   * @param data - The data to send in the request body.
   * @param config - The Axios request config.
   * @returns A Promise that resolves to the Axios response.
   */
  async patch<T = any, R = AxiosResponse<T>, D = any>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig<D>,
  ): Promise<R> {
    try {
      return this.axiosInstance.patch<T, R, D>(url, data, config);
    } catch (error) {
      return this.handleHttpError(error);
    }
  }

  /**
   * Sends an HTTP DELETE request.
   * @param url - The URL for the request.
   * @param config - The Axios request config.
   * @returns A Promise that resolves to the Axios response.
   */
  async delete<T = any, R = AxiosResponse<T>, D = any>(
    url: string,
    config?: AxiosRequestConfig<D>,
  ): Promise<R> {
    return this.axiosInstance.delete<T, R, D>(url, config);
  }

  /**
   * Sends an HTTP OPTIONS request.
   * @param url - The URL for the request.
   * @param config - The Axios request config.
   * @returns A Promise that resolves to the Axios response.
   */
  async options<T = any, R = AxiosResponse<T>, D = any>(
    url: string,
    config?: AxiosRequestConfig<D>,
  ): Promise<R> {
    try {
      return this.axiosInstance.options<T, R, D>(url, config);
    } catch (error) {
      return this.handleHttpError(error);
    }
  }

  /**
   * Sends an HTTP POST request with form data.
   * @param url - The URL for the request.
   * @param data - The form data to send in the request body.
   * @param config - The Axios request config.
   * @returns A Promise that resolves to the Axios response.
   */
  async postForm<T = any, R = AxiosResponse<T>, D = any>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig<D>,
  ): Promise<R> {
    try {
      return this.axiosInstance.postForm<T, R, D>(url, data, config);
    } catch (error) {
      return this.handleHttpError(error);
    }
  }

  /**
   * Sends an HTTP PUT request with form data.
   * @param url - The URL for the request.
   * @param data - The form data to send in the request body.
   * @param config - The Axios request config.
   * @returns A Promise that resolves to the Axios response.
   */
  async putForm<T = any, R = AxiosResponse<T>, D = any>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig<D>,
  ): Promise<R> {
    try {
      return this.axiosInstance.putForm<T, R, D>(url, data, config);
    } catch (error) {
      return this.handleHttpError(error);
    }
  }

  /**
   * Sends an HTTP PATCH request with form data.
   * @param url - The URL for the request.
   * @param data - The form data to send in the request body.
   * @param config - The Axios request config.
   * @returns A Promise that resolves to the Axios response.
   */
  async patchForm<T = any, R = AxiosResponse<T>, D = any>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig<D>,
  ): Promise<R> {
    try {
      return this.axiosInstance.patchForm<T, R, D>(url, data, config);
    } catch (error) {
      return this.handleHttpError(error);
    }
  }
}
