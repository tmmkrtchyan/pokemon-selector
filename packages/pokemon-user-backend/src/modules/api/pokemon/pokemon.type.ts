import { ObjectType, Field, ID, Int, InputType } from '@nestjs/graphql';

@ObjectType()
export class PokemonPaginationResponse {
  @Field(() => [PokemonType])
  data: PokemonType[];

  @Field(() => Int)
  total: number;

  @Field(() => Int)
  limit: number;

  @Field(() => Int)
  offset: number;
}


@ObjectType()
export class PokemonType {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;
}

