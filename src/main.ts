import * as dotenv from 'dotenv';
import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';

import { AppModule } from './app.module';

dotenv.config();

const devCorsOption = {
  origin: [
    'http://localhost:3000',
    'https://dolboda.kr',
    'https://alpha.dolboda.kr',
    'https://www.dol-bom.com',
  ],
  credentials: true,
};

const corsOption = {
  origin: ['https://dolboda.kr', 'https://alpha.dolboda.kr', 'https://www.dol-bom.com'],
  credentials: true,
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const option = process.env.NODE_ENV === 'DEV' ? devCorsOption : corsOption;
  app.enableCors(option);

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
