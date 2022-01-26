import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.use(cookieParser());
  await app.listen(3000);
}
bootstrap();

// restart Docker and start app
// docker rm -f $(docker ps -a -q) && docker-compose up -d && npm start dev

/*
docker ps
docker inspect <container id> | grep "IPAddress"
*/
