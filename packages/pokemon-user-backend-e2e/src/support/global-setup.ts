/* eslint-disable */
import { NestFactory } from '@nestjs/core';
import { DataSource } from 'typeorm';
import { Logger } from '@nestjs/common';
import { AppModule } from '../../../pokemon-user-backend/src/modules/app/app.module';
import { AppConfigService } from '../../../pokemon-user-backend/src/config/config.service';
import { startDatabase } from '../../../pokemon-user-backend/src/modules/database/db';
import { runSeed } from '../../../pokemon-user-backend/src/modules/database/run-seed';

var __TEARDOWN_MESSAGE__: string;

module.exports = async function () {
  console.log('\nSetting up...\n');

  try {
    // Start database and store container for teardown
    const container = await startDatabase();
    globalThis.__DB_CONTAINER__ = container;

    // Create NestJS application
    const app = await NestFactory.create(AppModule);

    // Run seed asynchronously
    const dataSource = app.get(DataSource);
    runSeed(dataSource).catch((error) => {
      Logger.error('Failed to run seed:', error);
    });

    // Configure app
    const configService = app.get(AppConfigService);
    const globalPrefix = configService.apiPrefix;
    app.setGlobalPrefix(globalPrefix).enableCors();
    const port = configService.port;

    // Start the application
    await app.listen(port);

    Logger.log(
      `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`
    );

    // Store app instance for teardown
    globalThis.__APP__ = app;
    globalThis.__PORT__ = port;
    globalThis.__TEARDOWN_MESSAGE__ = '\nTearing down...\n';
  } catch (error) {
    console.error('Failed to start application:', error);
    throw error;
  }
};
