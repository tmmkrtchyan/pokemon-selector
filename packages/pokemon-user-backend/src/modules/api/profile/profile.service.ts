import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QueryFailedError } from 'typeorm';
import { ProfileEntity } from '../../database/entities/profile.entity';
import { ProfilePokemonEntity } from '../../database/entities/profile-to-pokemon.entity';
import { PokemonEntity } from '../../database/entities/pokemon.entity';
import { AppConfigService } from '../../../config/config.service';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(ProfileEntity)
    private readonly profileRepository: Repository<ProfileEntity>,
    @InjectRepository(ProfilePokemonEntity)
    private readonly profilePokemonRepository: Repository<ProfilePokemonEntity>,
    @InjectRepository(PokemonEntity)
    private readonly pokemonRepository: Repository<PokemonEntity>,
    private readonly configService: AppConfigService,
  ) {}

  async getAll(): Promise<ProfileEntity[]> {
    return this.profileRepository.find();
  }

  async getOne(id: string): Promise<ProfileEntity> {
    const profile = await this.profileRepository.findOne({ where: { id } });

    if (!profile) {
      throw new NotFoundException(`Profile with id ${id} not found`);
    }

    return profile;
  }

  async create(name: string): Promise<ProfileEntity> {
    try {
      const profile = this.profileRepository.create({ name });
      return await this.profileRepository.save(profile);
    } catch (error) {
      if (error instanceof QueryFailedError && (error as any).code === '23505') {
        throw new ConflictException(`Profile with name "${name}" already exists`);
      }
      throw error;
    }
  }

  async getProfilePokemons(profileId: string): Promise<PokemonEntity[]> {
    const profilePokemons = await this.profilePokemonRepository.find({
      where: { profile: { id: profileId } },
      relations: ['pokemon'],
    });
    return profilePokemons.map(ptp => ptp.pokemon).filter(Boolean) as PokemonEntity[];
  }

  async addProfilePokemon(profileId: string, pokemonId: string): Promise<ProfileEntity> {
    return await this.profileRepository.manager.transaction(async (transactionalEntityManager) => {
      const [profile, pokemon] = await Promise.all([
        transactionalEntityManager.findOne(ProfileEntity, {
          where: { id: profileId },
        }),
        transactionalEntityManager.findOne(PokemonEntity, {
          where: { id: pokemonId },
        }),
      ]);

      if (!profile) {
        throw new NotFoundException(`Profile with id ${profileId} not found`);
      }

      if (!pokemon) {
        throw new NotFoundException(`Pokemon with id ${pokemonId} not found`);
      }

      const [currentCount, existingRelation] = await Promise.all([
        transactionalEntityManager.count(ProfilePokemonEntity, {
          where: { profile: { id: profileId } },
        }),
        transactionalEntityManager.findOne(ProfilePokemonEntity, {
          where: {
            profile: { id: profileId },
            pokemon: { id: pokemonId },
          },
        }),
      ]);

      const pokemonLimit = this.configService.pokemonLimit;
      if (currentCount >= pokemonLimit) {
        throw new BadRequestException(`Profile already has the maximum of ${pokemonLimit} pokemons. Cannot add more.`);
      }

      if (existingRelation) {
        throw new ConflictException(`Pokemon with id ${pokemonId} is already associated with this profile`);
      }

      const profilePokemon = transactionalEntityManager.create(ProfilePokemonEntity);
      profilePokemon.profile = profile;
      profilePokemon.pokemon = pokemon;
      await transactionalEntityManager.save(ProfilePokemonEntity, profilePokemon);

      const updatedProfile = await transactionalEntityManager.findOne(ProfileEntity, {
        where: { id: profileId },
      });

      if (!updatedProfile) {
        throw new NotFoundException(`Profile with id ${profileId} not found after update`);
      }

      return updatedProfile;
    });
  }

  async deleteProfilePokemon(profileId: string, pokemonId: string): Promise<ProfileEntity> {
    return await this.profileRepository.manager.transaction(async (transactionalEntityManager) => {
      const [profile, pokemon] = await Promise.all([
        transactionalEntityManager.findOne(ProfileEntity, {
          where: { id: profileId },
        }),
        transactionalEntityManager.findOne(PokemonEntity, {
          where: { id: pokemonId },
        }),
      ]);

      if (!profile) {
        throw new NotFoundException(`Profile with id ${profileId} not found`);
      }

      if (!pokemon) {
        throw new NotFoundException(`Pokemon with id ${pokemonId} not found`);
      }

      const deleteResult = await transactionalEntityManager.delete(ProfilePokemonEntity, {
        profile: { id: profileId },
        pokemon: { id: pokemonId },
      });

      if (deleteResult.affected === 0) {
        throw new NotFoundException(`Pokemon with id ${pokemonId} is not associated with this profile`);
      }

      const updatedProfile = await transactionalEntityManager.findOne(ProfileEntity, {
        where: { id: profileId },
      });

      if (!updatedProfile) {
        throw new NotFoundException(`Profile with id ${profileId} not found after update`);
      }

      return updatedProfile;
    });
  }
}

