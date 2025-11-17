import { NamedAPIResource } from './IPokemon';

export interface IPokemonAbility {
  name: string;
  is_hidden: boolean;
  description: string;
  ability: NamedAPIResource;
  slot?: number;
}
