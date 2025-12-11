import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import { ProfilePokemonEntity } from "./profile-to-pokemon.entity";

@Entity()
export class PokemonEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column({ unique: true })
    name: string

    @OneToMany(() => ProfilePokemonEntity, profileToPokemon => profileToPokemon.pokemon)
    public profileToPokemons: ProfilePokemonEntity[];
}

