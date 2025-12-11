import { useEffect, useState } from 'react';
import { useQuery } from '@apollo/client/react';
import { GET_POKEMONS } from '../../lib/graphql/queries';
import { PokemonType, PokemonPaginationResponse } from '../../types/pokemon.types';
import { appConfig } from '../../config/app.config';
import './PokemonTable.css';

interface PokemonTableProps {
  selectedPokemonIds: string[];
  onSelectPokemon: (pokemon: PokemonType) => void;
  maxSelectionReached?: boolean;
}

const config = appConfig();
const ITEMS_PER_PAGE = config.itemsPerPage;
const POKEMON_LIMIT = config.pokemonLimit;

export function PokemonTable({ selectedPokemonIds, onSelectPokemon, maxSelectionReached = false }: PokemonTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  const { data, loading, refetch, error } = useQuery<{ getPokemons: PokemonPaginationResponse }>(
    GET_POKEMONS,
    {
      variables: {
        pagination: {
          limit: ITEMS_PER_PAGE,
          offset,
        },
      },
      fetchPolicy: 'cache-and-network',
      notifyOnNetworkStatusChange: false,
    }
  );

  useEffect(() => {
    refetch()
  }, [selectedPokemonIds]);

  const handleRowClick = (pokemon: PokemonType) => {
    onSelectPokemon(pokemon);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (data?.getPokemons && currentPage < Math.ceil(data.getPokemons.total / ITEMS_PER_PAGE)) {
      setCurrentPage(currentPage + 1);
    }
  };

  if (loading) {
    return (
      <div className="pokemon-table-container">
        <div className="pokemon-table-loading">Loading pokemons...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pokemon-table-container">
        <div className="pokemon-table-error">
          Error loading pokemons: {error.message}
        </div>
      </div>
    );
  }

  const pokemons = data?.getPokemons.data || [];
  const total = data?.getPokemons.total || 0;
  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);

  return (
    <div className="pokemon-table-container">
      <h2 className="pokemon-table-title">Available Pokémons</h2>
      {maxSelectionReached && (
        <div style={{
          padding: '10px',
          marginBottom: '10px',
          backgroundColor: '#fff3cd',
          border: '1px solid #ffc107',
          borderRadius: '4px',
          color: '#856404'
        }}>
          Maximum of {POKEMON_LIMIT} Pokémons reached. Please remove a Pokémon before selecting another.
        </div>
      )}
      <div className="pokemon-table-wrapper">
        <table className="pokemon-table">
          <thead>
            <tr>
              <th>Name</th>
            </tr>
          </thead>
          <tbody>
            {pokemons.length === 0 ? (
              <tr>
                <td colSpan={1} className="pokemon-table-empty">
                  No pokemons available
                </td>
              </tr>
            ) : (
              pokemons.map((pokemon) => (
                <tr
                  key={pokemon.id}
                  className={`pokemon-table-row ${maxSelectionReached ? 'pokemon-table-row-disabled' : ''}`}
                  onClick={() => !maxSelectionReached && handleRowClick(pokemon)}
                  style={{ cursor: maxSelectionReached ? 'not-allowed' : 'pointer', opacity: maxSelectionReached ? 0.5 : 1 }}
                >
                  <td>{pokemon.name}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className="pokemon-table-pagination">
        <button
          className="pokemon-table-pagination-button"
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span className="pokemon-table-pagination-info">
          Page {currentPage} of {totalPages} (Total: {total})
        </span>
        <button
          className="pokemon-table-pagination-button"
          onClick={handleNextPage}
          disabled={currentPage >= totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
}

