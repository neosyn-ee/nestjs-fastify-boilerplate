import { FastifyCookieOptions } from '@fastify/cookie';
import { Injectable } from '@nestjs/common';
import { FastifyReply } from 'fastify';
import { CookieNames } from './cookie-names.enum';

@Injectable()
export class CookieService {
  setCookie(
    reply: FastifyReply,
    name: CookieNames,
    value: string,
    option?: FastifyCookieOptions,
  ) {
    reply.setCookie(name, value, {
      ...option,
      httpOnly: true,
      secure: false,
      expires: new Date(Date.now() + 1 * 24 * 60 * 1000),
      path: '/',
      sameSite: 'lax',
    });
  }
}
