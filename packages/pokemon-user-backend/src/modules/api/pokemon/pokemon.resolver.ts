import { Resolver, Query, Args, ID } from '@nestjs/graphql';
import { PokemonService } from './pokemon.service';
import { PokemonPaginationResponse, PokemonType } from './pokemon.type';
import { PaginationInput } from '../common/pagination.type';
import { AppConfigService } from '../../../config/config.service';

@Resolver(() => PokemonType)
export class PokemonResolver {
  constructor(
    private readonly pokemonService: PokemonService,
    private readonly configService: AppConfigService,
  ) {}

  @Query(() => PokemonPaginationResponse)
  async getPokemons(
    @Args('pagination', { nullable: true }) pagination?: PaginationInput,
  ): Promise<PokemonPaginationResponse> {
    const defaultLimit = this.configService.defaultPaginationLimit;
    const defaultOffset = this.configService.defaultPaginationOffset;
    const limit = pagination?.limit ?? defaultLimit;
    const offset = pagination?.offset ?? defaultOffset;
    const { data, total } = await this.pokemonService.getAll(limit, offset);

    return {
      data,
      total,
      limit,
      offset,
    };
  }

  @Query(() => PokemonType)
  async getPokemon(
    @Args('id', { type: () => ID }) id: string,
  ): Promise<PokemonType> {
    return this.pokemonService.getOne(id);
  }
}

