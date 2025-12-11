import { Injectable } from '@nestjs/common';
import { appConfig, AppConfig } from './app.config';

@Injectable()
export class AppConfigService {
  private readonly config: AppConfig;

  constructor() {
    this.config = appConfig();
  }

  get port(): number {
    return this.config.port;
  }

  get apiPrefix(): string {
    return this.config.apiPrefix;
  }

  get pokemonLimit(): number {
    return this.config.pokemonLimit;
  }

  get defaultPaginationLimit(): number {
    return this.config.defaultPaginationLimit;
  }

  get defaultPaginationOffset(): number {
    return this.config.defaultPaginationOffset;
  }
}

export { appConfig };

