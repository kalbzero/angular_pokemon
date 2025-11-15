export interface IPokemonTypeRelations {
  /** Tipos que causam o dobro de dano no Pokémon */
  weaknesses: string[];

  /** Tipos que causam metade do dano no Pokémon */
  resistances: string[];

  /** Tipos que não causam dano nenhum */
  immunities: string[];

  /**
   * Cálculo final de efetividade:
   * 2     = fraco (dano em dobro)
   * 0.5   = resistente
   * 0     = imune
   * 1     = dano normal
   */
  effectiveness?: Record<string, number>;
}