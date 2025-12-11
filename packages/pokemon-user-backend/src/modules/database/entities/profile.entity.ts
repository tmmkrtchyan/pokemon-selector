import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import { PokemonEntity } from "./pokemon.entity";
import { ProfilePokemonEntity } from "./profile-to-pokemon.entity";


@Entity()
export class ProfileEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column({ unique: true })
    name: string

    @OneToMany(() => ProfilePokemonEntity, profileToPokemon => profileToPokemon.profile)
    public profileToPokemons: ProfilePokemonEntity[];
}

