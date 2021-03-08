import * as dotenv from 'dotenv';
import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';

import { AppModule } from './app.module';

dotenv.config();

const corsOption = {
  origin: ['http://localhost:3000', 'https://dolboda.kr', 'https://alpha.dolboda.kr'],
  credentials: true,
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors(corsOption);
  app.setGlobalPrefix('api');

  app.use(cookieParser());
  app.useGlobalPipes(
    new ValidationPipe({
      disableErrorMessages: process.env.NODE_ENV !== 'DEV',
    }),
  );

  const port = parseInt(process.env.PORT);
  await app.listen(port);
}

bootstrap();
