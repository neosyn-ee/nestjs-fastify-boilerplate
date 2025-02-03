import {
  Catch,
  ExceptionFilter,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { FastifyReply, FastifyRequest } from 'fastify';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<FastifyReply>();
    const request = ctx.getRequest<FastifyRequest>();

    let status =
      exception instanceof HttpException ? exception.getStatus() : 500;
    let message =
      exception instanceof HttpException
        ? exception.message
        : 'Internal server error';

    if (exception.response) {
      status = exception.response.status || status;
      message = exception.response.data || message;
    }

    response.status(status).send({
      path: request.url,
      message,
      code: exception.response.code,
    });
  }
}
