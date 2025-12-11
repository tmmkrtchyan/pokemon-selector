import { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation } from '@apollo/client/react';
import { GET_PROFILE, ADD_PROFILE_POKEMON, DELETE_PROFILE_POKEMON } from '../../lib/graphql/queries';
import { ProfileType } from '../../types/profile.types';
import { PokemonType } from '../../types/pokemon.types';
import { SelectedPokemonsTable } from './SelectedPokemonsTable';
import { PokemonTable } from './PokemonTable';
import { appConfig } from '../../config/app.config';
import './PokemonManager.css';

const config = appConfig();
const POKEMON_LIMIT = config.pokemonLimit;

interface PokemonManagerProps {
  profileId: string;
}

export function PokemonManager({ profileId }: PokemonManagerProps) {
  const [selectedPokemonIds, setSelectedPokemonIds] = useState<string[]>([]);
  const [selectedPokemons, setSelectedPokemons] = useState<PokemonType[]>([]);
  const hasInitialized = useRef(false);

  const { data: profileData, loading: profileLoading } = useQuery<{
    getProfile: ProfileType;
  }>(GET_PROFILE, {
    variables: { id: profileId },
    fetchPolicy: 'cache-and-network',
    notifyOnNetworkStatusChange: false,
  });

  useEffect(() => {
    hasInitialized.current = false;
    setSelectedPokemonIds([]);
    setSelectedPokemons([]);
  }, [profileId]);

  useEffect(() => {
    if (!profileLoading && profileData?.getProfile && !hasInitialized.current) {
      const pokemons = profileData.getProfile.pokemon || [];
      const pokemonIds = pokemons.map((p) => p.id);
      setSelectedPokemonIds(pokemonIds);
      setSelectedPokemons(pokemons);
      hasInitialized.current = true;
    }
  }, [profileData, profileLoading]);

  const [addProfilePokemon, { loading: adding }] = useMutation<{
    addProfilePokemon: ProfileType;
  }>(ADD_PROFILE_POKEMON, {
    onCompleted: (data) => {
      const updatedPokemons = data.addProfilePokemon.pokemon || [];
      setSelectedPokemons(updatedPokemons);
      setSelectedPokemonIds(updatedPokemons.map((p) => p.id));
    },
  });

  const [deleteProfilePokemon, { loading: deleting }] = useMutation<{
    deleteProfilePokemon: ProfileType;
  }>(DELETE_PROFILE_POKEMON, {
    onCompleted: (data) => {
      const updatedPokemons = data.deleteProfilePokemon.pokemon || [];
      setSelectedPokemons(updatedPokemons);
      setSelectedPokemonIds(updatedPokemons.map((p) => p.id));
    },
  });

  const handleAddPokemon = async (pokemon: PokemonType) => {
    if (selectedPokemonIds.length >= POKEMON_LIMIT) {
      alert(`Maximum of ${POKEMON_LIMIT} pokemons allowed per profile. Please remove a pokemon before adding another.`);
      return;
    }

    try {
      await addProfilePokemon({
        variables: {
          profileId,
          pokemonId: pokemon.id,
        },
      });
    } catch (error: any) {
      const errorMessage = error?.message || 'Failed to add pokemon';
      alert(errorMessage);
      console.error('Failed to add pokemon:', error);
    }
  };

  const handleRemovePokemon = async (pokemonId: string) => {
    try {
      await deleteProfilePokemon({
        variables: {
          profileId,
          pokemonId,
        },
      });
    } catch (error) {
      console.error('Failed to remove pokemon:', error);
    }
  };

  if (profileLoading) {
    return (
      <div className="pokemon-manager-container">
        <div className="pokemon-manager-loading">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="pokemon-manager-container">
      <SelectedPokemonsTable
        pokemons={selectedPokemons}
        onRemove={handleRemovePokemon}
      />
      <PokemonTable
        selectedPokemonIds={selectedPokemonIds}
        onSelectPokemon={handleAddPokemon}
        maxSelectionReached={selectedPokemonIds.length >= POKEMON_LIMIT}
      />
      {(adding || deleting) && (
        <div className="pokemon-manager-updating">Updating profile...</div>
      )}
    </div>
  );
}

