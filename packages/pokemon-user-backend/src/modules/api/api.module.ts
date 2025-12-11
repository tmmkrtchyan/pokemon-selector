import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfileEntity } from '../database/entities/profile.entity';
import { PokemonEntity } from '../database/entities/pokemon.entity';
import { ProfilePokemonEntity } from '../database/entities/profile-to-pokemon.entity';
import { ProfileService } from './profile/profile.service';
import { PokemonService } from './pokemon/pokemon.service';
import { ProfileResolver } from './profile/profile.resolver';
import { PokemonResolver } from './pokemon/pokemon.resolver';
import { AppConfigService } from '../../config/config.service';

@Module({
  imports: [TypeOrmModule.forFeature([ProfileEntity, PokemonEntity, ProfilePokemonEntity])],
  providers: [AppConfigService, ProfileService, PokemonService, ProfileResolver, PokemonResolver],
  exports: [ProfileService, PokemonService],
})
export class ApiModule {}

