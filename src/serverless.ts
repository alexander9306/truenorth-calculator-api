import { NestFactory } from '@nestjs/core';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import serverlessExpress from '@vendia/serverless-express';
import { Callback, Context, Handler } from 'aws-lambda';
import helmet from 'helmet';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';

let server: Handler;

process.on('unhandledRejection', (reason) => {
  console.error(reason);
});

process.on('uncaughtException', (reason) => {
  console.error(reason);
});

async function bootstrap(): Promise<Handler> {
  const app = await NestFactory.create(AppModule);
  app.use(helmet());
  app.useGlobalPipes(new ValidationPipe());
  const configService: ConfigService = app.get(ConfigService);

  app.enableCors({ origin: configService.get('CORS_ORIGIN') || true });
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  await app.init();
  const expressApp = app.getHttpAdapter().getInstance();
  return serverlessExpress({ app: expressApp });
}

export const handler: Handler = async (
  event: any,
  context: Context,
  callback: Callback,
) => {
  server = server ?? (await bootstrap());
  return server(event, context, callback);
};
