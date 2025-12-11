import {Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import { PokemonEntity } from "./pokemon.entity";
import { ProfileEntity } from "./profile.entity";


@Entity()
export class ProfilePokemonEntity {
    @PrimaryGeneratedColumn("uuid")
    public id: number

    @Column()
    public pokemonId: number

    @Column()
    public profileId: number

    @ManyToOne(() => ProfileEntity, (profile) => profile.profileToPokemons)
    public profile: ProfileEntity

    @ManyToOne(() => PokemonEntity, (pokemon) => pokemon.profileToPokemons)
    public pokemon: PokemonEntity
}
