/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DataSource } from 'typeorm';

import { startDatabase } from './modules/database/db';
import { runSeed } from './modules/database/run-seed';
import { AppModule } from './modules/app/app.module';
import { AppConfigService } from './config/config.service';

async function bootstrap() {
  process.on('uncaughtException', (error) => {
    console.error(error);
    process.exit();
  });

  await startDatabase();

  const app = await NestFactory.create(AppModule);

  // Run seed asynchronously (don't block app startup)
  const dataSource = app.get(DataSource);
  runSeed(dataSource).catch((error) => {
    Logger.error('Failed to run seed:', error);
    // Continue even if seed fails (might already be seeded)
  });

  const configService = app.get(AppConfigService);
  const globalPrefix = configService.apiPrefix;
  app.setGlobalPrefix(globalPrefix).enableCors();
  const port = configService.port;
  await app.listen(port);
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`
  );
}

bootstrap();
