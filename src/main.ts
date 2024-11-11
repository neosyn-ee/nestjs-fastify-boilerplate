import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { TypedConfigService } from './config/typed-config.service';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import fastifyCookie from '@fastify/cookie';
import { CookieNames } from './cookie/cookie-names.enum';
import { LoggerService } from './logger/logger.service';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({ logger: false }),
  );

  const configService = app.get(TypedConfigService);
  const logger = app.get(LoggerService);

  const appPort = configService.get('APP.port');
  const appHost = configService.get('APP.host');
  const appName = configService.get('APP.name');
  const appVersion = configService.get('APP.version');
  const appDescription = configService.get('APP.description');
  const appJwt = configService.get('APP.jwt');

  const microserviceHost = configService.get('BOILERPLATE_MICROSERVICE.host');
  const microservicePort = configService.get('BOILERPLATE_MICROSERVICE.port');

  await app.register(fastifyCookie, {
    secret: appJwt, // for cookies signature
  });

  const microservice = app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
    options: {
      host: microserviceHost,
      port: microservicePort,
    },
  });

  console.log(microservice);

  const config = new DocumentBuilder()
    .setTitle(appName)
    .setDescription(appDescription)
    .setVersion(appVersion)
    .addCookieAuth(CookieNames.AccessToken)
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    jsonDocumentUrl: 'swagger/json',
  });

  await app.startAllMicroservices();
  await app.listen(appPort, '0.0.0.0');
  logger.info(`Application ${appName} is running on ${appHost}:${appPort}`);
}
bootstrap();
