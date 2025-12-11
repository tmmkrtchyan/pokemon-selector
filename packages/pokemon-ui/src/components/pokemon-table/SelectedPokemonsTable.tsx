import { PokemonType } from '../../types/pokemon.types';
import './SelectedPokemonsTable.css';

interface SelectedPokemonsTableProps {
  pokemons: PokemonType[];
  onRemove: (pokemonId: string) => void;
}

export function SelectedPokemonsTable({ pokemons, onRemove }: SelectedPokemonsTableProps) {
  if (pokemons.length === 0) {
    return (
      <div className="selected-pokemons-container">
        <h2 className="selected-pokemons-title">Pokémons related to this profile</h2>
        <div className="selected-pokemons-empty">No Pokémons found</div>
      </div>
    );
  }

  return (
    <div className="selected-pokemons-container">
      <h2 className="selected-pokemons-title">Pokémons related to this profile</h2>
      <div className="selected-pokemons-list">
        {pokemons.map((pokemon) => (
          <div key={pokemon.id} className="selected-pokemon-card">
            <span className="selected-pokemon-name">{pokemon.name}</span>
            <button
              className="selected-pokemons-remove-button"
              onClick={() => onRemove(pokemon.id)}
              aria-label={`Remove ${pokemon.name}`}
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

