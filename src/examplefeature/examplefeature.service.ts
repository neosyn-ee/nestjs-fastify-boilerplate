import { Injectable } from '@nestjs/common';

@Injectable()
export class ExamplefeatureService {
  getHello(): string {
    return 'Hello Neosyn!!!';
  }
}
