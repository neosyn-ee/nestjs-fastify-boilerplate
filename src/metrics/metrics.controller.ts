import { Controller, Get, Header } from '@nestjs/common';
import { MetricsService } from './metrics.service';
import { ApiTags } from '@nestjs/swagger';

@Controller('metrics')
@ApiTags('Metrics')
export class MetricsController {
  constructor(private readonly metricsService: MetricsService) {}

  @Get()
  @Header('Content-Type', 'text/plain')
  async getMetrics(): Promise<string> {
    return this.metricsService.getMetrics();
  }
}
