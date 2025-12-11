import { gql } from '@apollo/client';

export const GET_PROFILES = gql`
  query GetProfiles {
    getProfiles {
      id
      name
    }
  }
`;

export const CREATE_PROFILE = gql`
  mutation CreateProfile($name: String!) {
    createProfile(name: $name) {
      id
      name
    }
  }
`;

export const GET_PROFILE = gql`
  query GetProfile($id: ID!) {
    getProfile(id: $id) {
      id
      name
      pokemon {
        id
        name
      }
    }
  }
`;

export const GET_POKEMONS = gql`
  query GetPokemons($pagination: PaginationInput) {
    getPokemons(pagination: $pagination) {
      data {
        id
        name
      }
      total
      limit
      offset
    }
  }
`;

export const ADD_PROFILE_POKEMON = gql`
  mutation AddProfilePokemon($profileId: ID!, $pokemonId: ID!) {
    addProfilePokemon(profileId: $profileId, pokemonId: $pokemonId) {
      id
      name
      pokemon {
        id
        name
      }
    }
  }
`;

export const DELETE_PROFILE_POKEMON = gql`
  mutation DeleteProfilePokemon($profileId: ID!, $pokemonId: ID!) {
    deleteProfilePokemon(profileId: $profileId, pokemonId: $pokemonId) {
      id
      name
      pokemon {
        id
        name
      }
    }
  }
`;

