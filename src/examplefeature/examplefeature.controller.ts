import { Body, Controller, Get, HttpException, HttpStatus, Post } from '@nestjs/common';
import { ExampleFeatureService } from './examplefeature.service';
import { ExampleFeatureInsertInputDto } from './dto/exampleFeatureInsertInput.dto';

@Controller('Example')
export class ExamplefeatureController {
  constructor(private readonly exampleFeatureService: ExampleFeatureService) {}

  @Get('test')
  async getExample(): Promise<string> {
    return this.exampleFeatureService.getHello();
  }
  @Post()
  async insertHello(@Body() exampleFeatureInsertInputDto: ExampleFeatureInsertInputDto): Promise<string> {
    throw new HttpException('Forbidden', HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
