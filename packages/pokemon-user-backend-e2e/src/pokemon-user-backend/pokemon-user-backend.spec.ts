import axios from 'axios';

const GRAPHQL_ENDPOINT = globalThis.__GRAPHQL_ENDPOINT__ || 'http://localhost:3000/graphql';

interface GraphQLResponse<T = any> {
  data?: T;
  errors?: Array<{ message: string; extensions?: any }>;
}

async function graphqlRequest<T = any>(
  query: string,
  variables?: Record<string, any>
): Promise<GraphQLResponse<T>> {
  const response = await axios.post<GraphQLResponse<T>>(
    GRAPHQL_ENDPOINT,
    {
      query,
      variables,
    },
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );

  if (response.data.errors) {
    throw new Error(
      `GraphQL errors: ${response.data.errors.map((e) => e.message).join(', ')}`
    );
  }

  return response.data;
}

describe('Pokemon User Backend GraphQL API', () => {
  describe('Pokemon Queries', () => {
    it('should get all pokemons with default pagination', async () => {
      const query = `
        query {
          getPokemons {
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

      const response = await graphqlRequest(query);
      expect(response.data).toBeDefined();
      expect(response.data?.getPokemons).toBeDefined();
      expect(response.data?.getPokemons.data).toBeInstanceOf(Array);
      expect(response.data?.getPokemons.total).toBeGreaterThan(0);
      expect(response.data?.getPokemons.limit).toBe(10);
      expect(response.data?.getPokemons.offset).toBe(0);
    });

    it('should get pokemons with custom pagination', async () => {
      const query = `
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

      const variables = {
        pagination: {
          limit: 5,
          offset: 0,
        },
      };

      const response = await graphqlRequest(query, variables);
      expect(response.data).toBeDefined();
      expect(response.data?.getPokemons).toBeDefined();
      expect(response.data?.getPokemons.data.length).toBeLessThanOrEqual(5);
      expect(response.data?.getPokemons.limit).toBe(5);
      expect(response.data?.getPokemons.offset).toBe(0);
    });

    it('should get a single pokemon by id', async () => {
      // First, get a pokemon ID
      const listQuery = `
        query {
          getPokemons(pagination: { limit: 1 }) {
            data {
              id
              name
            }
          }
        }
      `;

      const listResponse = await graphqlRequest(listQuery);
      const pokemonId = listResponse.data?.getPokemons.data[0].id;
      const pokemonName = listResponse.data?.getPokemons.data[0].name;

      const query = `
        query GetPokemon($id: ID!) {
          getPokemon(id: $id) {
            id
            name
          }
        }
      `;

      const variables = { id: pokemonId };
      const response = await graphqlRequest(query, variables);

      expect(response.data).toBeDefined();
      expect(response.data?.getPokemon).toBeDefined();
      expect(response.data?.getPokemon.id).toBe(pokemonId);
      expect(response.data?.getPokemon.name).toBe(pokemonName);
    });

    it('should return error for non-existent pokemon', async () => {
      const query = `
        query GetPokemon($id: ID!) {
          getPokemon(id: $id) {
            id
            name
          }
        }
      `;

      const variables = { id: 'non-existent-id' };

      await expect(graphqlRequest(query, variables)).rejects.toThrow();
    });
  });

  describe('Profile Queries', () => {
    it('should get all profiles', async () => {
      const query = `
        query {
          getProfiles {
            id
            name
            pokemon {
              id
              name
            }
          }
        }
      `;

      const response = await graphqlRequest(query);
      expect(response.data).toBeDefined();
      expect(response.data?.getProfiles).toBeInstanceOf(Array);
    });

    it('should get a single profile by id', async () => {
      // First, create a profile to query
      const createMutation = `
        mutation CreateProfile($name: String!) {
          createProfile(name: $name) {
            id
            name
          }
        }
      `;

      const createResponse = await graphqlRequest(createMutation, {
        name: 'Test Profile Query',
      });
      const profileId = createResponse.data?.createProfile.id;

      const query = `
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

      const variables = { id: profileId };
      const response = await graphqlRequest(query, variables);

      expect(response.data).toBeDefined();
      expect(response.data?.getProfile).toBeDefined();
      expect(response.data?.getProfile.id).toBe(profileId);
      expect(response.data?.getProfile.name).toBe('Test Profile Query');
      expect(response.data?.getProfile.pokemon).toBeInstanceOf(Array);
    });

    it('should return error for non-existent profile', async () => {
      const query = `
        query GetProfile($id: ID!) {
          getProfile(id: $id) {
            id
            name
          }
        }
      `;

      const variables = { id: 'non-existent-id' };

      await expect(graphqlRequest(query, variables)).rejects.toThrow();
    });
  });

  describe('Profile Mutations', () => {
    it('should create a new profile', async () => {
      const mutation = `
        mutation CreateProfile($name: String!) {
          createProfile(name: $name) {
            id
            name
            pokemon {
              id
              name
            }
          }
        }
      `;

      const variables = { name: 'Test Profile' };
      const response = await graphqlRequest(mutation, variables);

      expect(response.data).toBeDefined();
      expect(response.data?.createProfile).toBeDefined();
      expect(response.data?.createProfile.id).toBeDefined();
      expect(response.data?.createProfile.name).toBe('Test Profile');
      expect(response.data?.createProfile.pokemon).toBeInstanceOf(Array);
    });

    it('should add a pokemon to a profile', async () => {
      // Create a profile
      const createProfileMutation = `
        mutation CreateProfile($name: String!) {
          createProfile(name: $name) {
            id
            name
          }
        }
      `;

      const profileResponse = await graphqlRequest(createProfileMutation, {
        name: 'Profile with Pokemon',
      });
      const profileId = profileResponse.data?.createProfile.id;

      // Get a pokemon ID
      const pokemonQuery = `
        query {
          getPokemons(pagination: { limit: 1 }) {
            data {
              id
              name
            }
          }
        }
      `;

      const pokemonResponse = await graphqlRequest(pokemonQuery);
      const pokemonId = pokemonResponse.data?.getPokemons.data[0].id;
      const pokemonName = pokemonResponse.data?.getPokemons.data[0].name;

      // Add pokemon to profile
      const addMutation = `
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

      const addVariables = {
        profileId,
        pokemonId,
      };

      const addResponse = await graphqlRequest(addMutation, addVariables);

      expect(addResponse.data).toBeDefined();
      expect(addResponse.data?.addProfilePokemon).toBeDefined();
      expect(addResponse.data?.addProfilePokemon.id).toBe(profileId);
      expect(addResponse.data?.addProfilePokemon.pokemon).toBeInstanceOf(Array);
      expect(addResponse.data?.addProfilePokemon.pokemon.length).toBe(1);
      expect(addResponse.data?.addProfilePokemon.pokemon[0].id).toBe(pokemonId);
      expect(addResponse.data?.addProfilePokemon.pokemon[0].name).toBe(
        pokemonName
      );
    });

    it('should add multiple pokemons to a profile', async () => {
      // Create a profile
      const createProfileMutation = `
        mutation CreateProfile($name: String!) {
          createProfile(name: $name) {
            id
            name
          }
        }
      `;

      const profileResponse = await graphqlRequest(createProfileMutation, {
        name: 'Profile with Multiple Pokemon',
      });
      const profileId = profileResponse.data?.createProfile.id;

      // Get multiple pokemon IDs
      const pokemonQuery = `
        query {
          getPokemons(pagination: { limit: 3 }) {
            data {
              id
              name
            }
          }
        }
      `;

      const pokemonResponse = await graphqlRequest(pokemonQuery);
      const pokemons = pokemonResponse.data?.getPokemons.data;

      // Add each pokemon to the profile
      const addMutation = `
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

      let currentProfile = profileResponse.data?.createProfile;

      for (const pokemon of pokemons) {
        const addResponse = await graphqlRequest(addMutation, {
          profileId,
          pokemonId: pokemon.id,
        });
        currentProfile = addResponse.data?.addProfilePokemon;
      }

      expect(currentProfile.pokemon.length).toBe(3);
    });

    it('should delete a pokemon from a profile', async () => {
      // Create a profile
      const createProfileMutation = `
        mutation CreateProfile($name: String!) {
          createProfile(name: $name) {
            id
            name
          }
        }
      `;

      const profileResponse = await graphqlRequest(createProfileMutation, {
        name: 'Profile for Deletion Test',
      });
      const profileId = profileResponse.data?.createProfile.id;

      // Get a pokemon ID
      const pokemonQuery = `
        query {
          getPokemons(pagination: { limit: 1 }) {
            data {
              id
              name
            }
          }
        }
      `;

      const pokemonResponse = await graphqlRequest(pokemonQuery);
      const pokemonId = pokemonResponse.data?.getPokemons.data[0].id;

      // Add pokemon to profile
      const addMutation = `
        mutation AddProfilePokemon($profileId: ID!, $pokemonId: ID!) {
          addProfilePokemon(profileId: $profileId, pokemonId: $pokemonId) {
            id
            pokemon {
              id
            }
          }
        }
      `;

      await graphqlRequest(addMutation, {
        profileId,
        pokemonId,
      });

      // Delete pokemon from profile
      const deleteMutation = `
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

      const deleteResponse = await graphqlRequest(deleteMutation, {
        profileId,
        pokemonId,
      });

      expect(deleteResponse.data).toBeDefined();
      expect(deleteResponse.data?.deleteProfilePokemon).toBeDefined();
      expect(deleteResponse.data?.deleteProfilePokemon.id).toBe(profileId);
      expect(deleteResponse.data?.deleteProfilePokemon.pokemon).toBeInstanceOf(
        Array
      );
      expect(deleteResponse.data?.deleteProfilePokemon.pokemon.length).toBe(0);
    });
  });

  describe('Integration Tests', () => {
    it('should perform a complete workflow: create profile, add pokemons, query profile', async () => {
      // Create profile
      const createMutation = `
        mutation CreateProfile($name: String!) {
          createProfile(name: $name) {
            id
            name
          }
        }
      `;

      const createResponse = await graphqlRequest(createMutation, {
        name: 'Complete Workflow Profile',
      });
      const profileId = createResponse.data?.createProfile.id;

      // Get pokemons
      const pokemonQuery = `
        query {
          getPokemons(pagination: { limit: 2 }) {
            data {
              id
              name
            }
          }
        }
      `;

      const pokemonResponse = await graphqlRequest(pokemonQuery);
      const pokemons = pokemonResponse.data?.getPokemons.data;

      // Add pokemons to profile
      const addMutation = `
        mutation AddProfilePokemon($profileId: ID!, $pokemonId: ID!) {
          addProfilePokemon(profileId: $profileId, pokemonId: $pokemonId) {
            id
            pokemon {
              id
              name
            }
          }
        }
      `;

      for (const pokemon of pokemons) {
        await graphqlRequest(addMutation, {
          profileId,
          pokemonId: pokemon.id,
        });
      }

      // Query profile to verify
      const profileQuery = `
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

      const profileResponse = await graphqlRequest(profileQuery, {
        id: profileId,
      });

      expect(profileResponse.data?.getProfile.id).toBe(profileId);
      expect(profileResponse.data?.getProfile.name).toBe(
        'Complete Workflow Profile'
      );
      expect(profileResponse.data?.getProfile.pokemon.length).toBe(2);
    });
  });
});
