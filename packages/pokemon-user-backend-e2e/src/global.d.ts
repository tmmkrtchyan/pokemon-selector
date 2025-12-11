/* eslint-disable */
import { INestApplication } from '@nestjs/common';
import { StartedPostgreSqlContainer } from '@testcontainers/postgresql';

declare global {
  var __APP__: INestApplication;
  var __PORT__: number;
  var __TEARDOWN_MESSAGE__: string;
  var __GRAPHQL_ENDPOINT__: string;
  var __DB_CONTAINER__: StartedPostgreSqlContainer;
}

export {};

