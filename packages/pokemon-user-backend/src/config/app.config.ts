export interface AppConfig {
  port: number;
  apiPrefix: string;
  pokemonLimit: number;
  defaultPaginationLimit: number;
  defaultPaginationOffset: number;
}

export const appConfig = (): AppConfig => ({
  port: parseInt(process.env.PORT || '3000', 10),
  apiPrefix: process.env.API_PREFIX || 'api',
  pokemonLimit: parseInt(process.env.POKEMON_LIMIT || '6', 10),
  defaultPaginationLimit: parseInt(process.env.DEFAULT_PAGINATION_LIMIT || '10', 10),
  defaultPaginationOffset: parseInt(process.env.DEFAULT_PAGINATION_OFFSET || '0', 10),
});

