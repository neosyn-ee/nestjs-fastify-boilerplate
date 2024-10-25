import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpStatus,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

import { LoggerService } from './logger.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly loggerService: LoggerService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    const { ip, method, url, body } = request;
    const correlationId = uuidv4();
    request.correlationId = correlationId;

    // Log the incoming request
    //FIXME: replace {microserviceName} with env var
    this.loggerService.info(
      `{microserviceName} Incoming request: ${method} ${url} ${correlationId}`,
      {
        request: {
          body,
          ip,
        },
      },
    );

    const now = Date.now();

    return next.handle().pipe(
      tap((responseBody) => {
        const duration = Date.now() - now;

        // Log the response details
        this.loggerService.info(
          `{microserviceName} Response sent: ${method} ${url} ${correlationId} ${response.statusCode}`,
          {
            response: {
              body: responseBody,
              statusCode: response.statusCode,
              duration,
            },
          },
        );
      }),
      catchError((error) => {
        const duration = Date.now() - now;
        const statusCode = error?.status || HttpStatus.INTERNAL_SERVER_ERROR;

        // Log the error response details
        this.loggerService.error(
          `{microserviceName} Error occurred: ${method} ${url} ${correlationId} ${statusCode}`,
          JSON.stringify({
            response: {
              message: error.message,
              stack: error.stack,
              statusCode,
            },
            duration,
          }),
        );

        return throwError(() => error);
      }),
    );
  }
}
