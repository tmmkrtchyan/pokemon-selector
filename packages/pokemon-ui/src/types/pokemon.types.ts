export interface PokemonType {
  id: string;
  name: string;
}

export interface PokemonPaginationResponse {
  data: PokemonType[];
  total: number;
  limit: number;
  offset: number;
}

