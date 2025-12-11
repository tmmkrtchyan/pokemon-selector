import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PokemonEntity } from '../../database/entities/pokemon.entity';
import { ProfilePokemonEntity } from '../../database/entities/profile-to-pokemon.entity';
import { AppConfigService } from '../../../config/config.service';

@Injectable()
export class PokemonService {
  constructor(
    @InjectRepository(PokemonEntity)
    private readonly pokemonRepository: Repository<PokemonEntity>,
    private readonly configService: AppConfigService,
  ) {}

  async getAll(
    limit?: number,
    offset?: number,
  ): Promise<{ data: PokemonEntity[]; total: number }> {
    const defaultLimit = this.configService.defaultPaginationLimit;
    const defaultOffset = this.configService.defaultPaginationOffset;
    const finalLimit = limit ?? defaultLimit;
    const finalOffset = offset ?? defaultOffset;
    const queryBuilder = this.pokemonRepository.createQueryBuilder('pokemon');

    // Use LEFT JOIN to filter out pokemons that are selected (have a relationship in ProfilePokemonEntity)
    queryBuilder
      .leftJoin('pokemon.profileToPokemons', 'profileToPokemon')
      .where('profileToPokemon.id IS NULL');

    queryBuilder.orderBy('pokemon.name', 'ASC');

    const [data, total] = await queryBuilder
      .take(finalLimit)
      .skip(finalOffset)
      .getManyAndCount();

    return { data, total };
  }

  async getOne(id: string): Promise<PokemonEntity> {
    const pokemon = await this.pokemonRepository.findOne({ where: { id } });

    if (!pokemon) {
      throw new NotFoundException(`Pokemon with id ${id} not found`);
    }

    return pokemon;
  }
}

