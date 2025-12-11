import { Resolver, Query, Mutation, Args, ID, ResolveField, Parent } from '@nestjs/graphql';
import { ProfileService } from './profile.service';
import { ProfileType } from './profile.type';
import { PokemonType } from '../pokemon/pokemon.type';

@Resolver(() => ProfileType)
export class ProfileResolver {
  constructor(
    private readonly profileService: ProfileService,
  ) {}

  @Query(() => [ProfileType])
  async getProfiles(): Promise<ProfileType[]> {
    return this.profileService.getAll();
  }

  @Query(() => ProfileType)
  async getProfile(
    @Args('id', { type: () => ID }) id: string,
  ): Promise<ProfileType> {
    return this.profileService.getOne(id);
  }

  @ResolveField(() => [PokemonType], { nullable: true })
  async pokemon(@Parent() profile: ProfileType): Promise<PokemonType[]> {
    return this.profileService.getProfilePokemons(profile.id);
  }

  @Mutation(() => ProfileType)
  async createProfile(
    @Args('name') name: string,
  ): Promise<ProfileType> {
    return this.profileService.create(name);
  }

  @Mutation(() => ProfileType)
  async addProfilePokemon(
    @Args('profileId', { type: () => ID }) profileId: string,
    @Args('pokemonId', { type: () => ID }) pokemonId: string,
  ): Promise<ProfileType> {
    return this.profileService.addProfilePokemon(profileId, pokemonId);
  }

  @Mutation(() => ProfileType)
  async deleteProfilePokemon(
    @Args('profileId', { type: () => ID }) profileId: string,
    @Args('pokemonId', { type: () => ID }) pokemonId: string,
  ): Promise<ProfileType> {
    return this.profileService.deleteProfilePokemon(profileId, pokemonId);
  }
}

