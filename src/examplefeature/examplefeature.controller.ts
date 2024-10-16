import { Body, Controller, Get, Post } from '@nestjs/common';
import { ExamplefeatureService } from './examplefeature.service';
import { ExampleFeatureInsertInputDto } from './dto/exampleFeatureInsertInput.dto';

@Controller('Example')
export class ExamplefeatureController {
  constructor(private readonly examplefeatureService: ExamplefeatureService) {}

  @Get('test')
  async getExample(): Promise<string> {
    return this.examplefeatureService.getHello();
  }
  @Post()
  async insertHello(@Body() exampleFeatureInsertInputDto: ExampleFeatureInsertInputDto): Promise<string> {
    return "post service";
  }
}
