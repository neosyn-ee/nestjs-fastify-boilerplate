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

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({ logger: false }),
  );

  const configService = app.get(TypedConfigService);
  const appPort = configService.get('APP.port');
  const appName = configService.get('APP.name');
  const appVersion = configService.get('APP.version');
  const appDescription = configService.get('APP.description');
  const appJwt = configService.get('APP.jwt');

  await app.register(fastifyCookie, {
    secret: appJwt, // for cookies signature
  });

  const microservice = app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
    options: {
      host: 'localhost', // Cambia con l'host desiderato
      port: 3002, // Porta per il microservizio
    },
  });

  //FIXME: remove this line (issue: @typescript-eslint/no-unused-vars)
  console.log(microservice);

  const config = new DocumentBuilder()
    .setTitle(appName)
    .setDescription(appDescription)
    .setVersion(appVersion)
    .addCookieAuth('access_token')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    jsonDocumentUrl: 'swagger/json',
  });

  await app.listen(appPort, '0.0.0.0');
}
bootstrap();
