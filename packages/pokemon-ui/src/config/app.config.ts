export interface AppConfig {
  graphqlEndpoint: string;
  itemsPerPage: number;
  pokemonLimit: number;
}

export const appConfig = (): AppConfig => ({
  graphqlEndpoint: import.meta.env.VITE_GRAPHQL_ENDPOINT || 'http://localhost:3000/graphql',
  itemsPerPage: parseInt(import.meta.env.VITE_ITEMS_PER_PAGE || '10', 10),
  pokemonLimit: parseInt(import.meta.env.VITE_POKEMON_LIMIT || '6', 10),
});

