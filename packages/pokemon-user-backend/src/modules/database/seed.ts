import { DataSource } from 'typeorm';
import { PokemonEntity } from './entities/pokemon.entity';

const generateRandomName = (): string => {
  const prefixes = [
    'Aero', 'Aqua', 'Blaze', 'Crystal', 'Dark', 'Echo', 'Flame', 'Frost',
    'Glow', 'Ice', 'Light', 'Mystic', 'Night', 'Ocean', 'Power', 'Quick',
    'Shadow', 'Storm', 'Thunder', 'Wind', 'Zen', 'Alpha', 'Beta', 'Gamma',
    'Cosmic', 'Dragon', 'Fire', 'Earth', 'Sky', 'Star', 'Moon', 'Sun'
  ];

  const suffixes = [
    'mon', 'gon', 'ron', 'ion', 'eon', 'ite', 'ium', 'oid',
    'wing', 'claw', 'tail', 'fang', 'scale', 'spike', 'horn', 'beam',
    'bolt', 'blast', 'wave', 'storm', 'flare', 'shock', 'ray', 'beam',
    'saur', 'dactyl', 'raptor', 'rex', 'saurus', 'phile', 'phobe', 'morph'
  ];

  const middleParts = [
    'a', 'e', 'i', 'o', 'u', 'ar', 'er', 'ir', 'or', 'ur',
    'al', 'el', 'il', 'ol', 'ul', 'an', 'en', 'in', 'on', 'un'
  ];

  // Randomly choose a pattern
  const pattern = Math.floor(Math.random() * 3);

  if (pattern === 0) {
    // Prefix + Middle + Suffix
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const middle = middleParts[Math.floor(Math.random() * middleParts.length)];
    const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
    return `${prefix}${middle}${suffix}`;
  } else if (pattern === 1) {
    // Prefix + Suffix
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
    return `${prefix}${suffix}`;
  } else {
    // Two prefixes combined
    const prefix1 = prefixes[Math.floor(Math.random() * prefixes.length)];
    const prefix2 = prefixes[Math.floor(Math.random() * prefixes.length)];
    return `${prefix1}${prefix2}`;
  }
};

const generateUniqueNames = (count: number): string[] => {
  const names = new Set<string>();
  let attempts = 0;
  const maxAttempts = count * 10; // Prevent infinite loop

  while (names.size < count && attempts < maxAttempts) {
    const name = generateRandomName();
    names.add(name);
    attempts++;
  }

  return Array.from(names);
};

export const seedPokemon = async (dataSource: DataSource): Promise<void> => {
  const pokemonRepository = dataSource.getRepository(PokemonEntity);

  // Check if pokemon already exist
  const existingCount = await pokemonRepository.count();
  if (existingCount > 0) {
    console.log(`Pokemon seed already completed (${existingCount} pokemon exist). Skipping...`);
    return;
  }

  const targetCount = 150;
  const neededCount = targetCount - existingCount;

  console.log(`Starting Pokemon seed... (${existingCount} existing, need ${neededCount} more)`);

  // Generate unique random names
  const names = generateUniqueNames(neededCount);

  // Create pokemon entities
  const pokemons = names.map(name => {
    const pokemon = new PokemonEntity();
    pokemon.name = name;
    return pokemon;
  });

  // Insert in batches to avoid potential issues
  const batchSize = 50;
  let insertedCount = 0;

  for (let i = 0; i < pokemons.length; i += batchSize) {
    const batch = pokemons.slice(i, i + batchSize);
    try {
      await pokemonRepository.save(batch);
      insertedCount += batch.length;
      console.log(`Inserted batch ${Math.floor(i / batchSize) + 1} of ${Math.ceil(pokemons.length / batchSize)} (${insertedCount}/${neededCount})`);
    } catch (error: any) {
      // Handle unique constraint violations by trying individual inserts
      console.log(`Batch insert had conflicts, trying individual inserts...`);
      for (const pokemon of batch) {
        try {
          await pokemonRepository.save(pokemon);
          insertedCount++;
        } catch (individualError: any) {
          // Skip duplicates or other errors
          console.log(`Skipped duplicate or error: ${pokemon.name}`);
        }
      }
    }
  }

  const finalCount = await pokemonRepository.count();
  console.log(`Successfully seeded pokemon! Total count: ${finalCount}`);
};

