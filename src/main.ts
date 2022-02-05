import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { ConfigService } from '@nestjs/config';
import { config } from 'aws-sdk';
import rawBodyMiddleware from './utils/rawBody.middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  app.enableCors({
    origin: configService.get('FRONTEND_URL'),
    credentials: true
  });

  app.use(rawBodyMiddleware());
  
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.use(cookieParser());

  config.update({
    accessKeyId: configService.get('AWS_ACCESS_KEY_ID'),
    secretAccessKey: configService.get('AWS_SECRET_ACCESS_KEY'),
    region: configService.get('AWS_REGION'),
  });

  await app.listen(3000);
}
bootstrap();

/* Docker
restart Docker and start app
docker rm -f $(docker ps -a -q) && docker-compose up -d && npm start dev
docker ps
docker inspect <container id> | grep "IPAddress"


Elastic Search Fix!
for windows users, using wsl subsystem
open powershell run
wsl -d docker-desktop
then
sysctl -w vm.max_map_count=262144
`*/
