import { ObjectType, Field, ID } from '@nestjs/graphql';
import { PokemonType } from '../pokemon/pokemon.type';

@ObjectType()
export class ProfileType {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field(() => [PokemonType], { nullable: true })
  pokemon?: PokemonType[];
}

