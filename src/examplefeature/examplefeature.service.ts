import { Injectable } from '@nestjs/common';
import { LoggerService } from 'src/logger/logger.service';

@Injectable()
export class ExampleFeatureService {
  constructor(private readonly logger: LoggerService){}

  getHello(): string {
    this.logger.info('this is info log of ExampleFeatureService')
    return 'Hello Neosyn!!!';
  }
}
