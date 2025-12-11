import { PokemonType } from './pokemon.types';

export interface ProfileType {
  id: string;
  name: string;
  pokemon?: PokemonType[];
}

