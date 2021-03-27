import * as dotenv from 'dotenv';
import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
import * as Sentry from '@sentry/node';
import * as Tracing from '@sentry/tracing';

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

  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    tracesSampleRate: 1.0,
  });

  const port = parseInt(process.env.PORT);
  await app.listen(port);
}

bootstrap();
