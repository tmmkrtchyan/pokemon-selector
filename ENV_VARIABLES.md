# Environment Variables

This document describes all environment variables used in the project.

## Backend (pokemon-user-backend)

Create a `.env` file in `packages/pokemon-user-backend/` with the following variables:

```env
# Server Configuration
PORT=3000
API_PREFIX=api

# Pokemon Configuration
POKEMON_LIMIT=6

# Pagination Configuration
DEFAULT_PAGINATION_LIMIT=10
DEFAULT_PAGINATION_OFFSET=0
```

### Variables

- `PORT` - Server port (default: 3000)
- `API_PREFIX` - Global API prefix (default: 'api')
- `POKEMON_LIMIT` - Maximum number of pokemons per profile (default: 6)
- `DEFAULT_PAGINATION_LIMIT` - Default pagination limit (default: 10)
- `DEFAULT_PAGINATION_OFFSET` - Default pagination offset (default: 0)

## Frontend (pokemon-ui)

Create a `.env` file in `packages/pokemon-ui/` with the following variables:

```env
# GraphQL Configuration
VITE_GRAPHQL_ENDPOINT=http://localhost:3000/graphql

# Pagination Configuration
VITE_ITEMS_PER_PAGE=10

# Pokemon Configuration
VITE_POKEMON_LIMIT=6
```

### Variables

- `VITE_GRAPHQL_ENDPOINT` - GraphQL API endpoint URL (default: http://localhost:3000/graphql)
- `VITE_ITEMS_PER_PAGE` - Number of items per page in pagination (default: 10)
- `VITE_POKEMON_LIMIT` - Maximum number of pokemons per profile (default: 6)

**Note:** Frontend environment variables must be prefixed with `VITE_` to be accessible in the application.

