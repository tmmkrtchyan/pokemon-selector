import { DataSource } from 'typeorm';
import { seedPokemon } from './seed';

export const runSeed = async (dataSource: DataSource): Promise<void> => {
  try {
    console.log('Running Pokemon seed...');
    await seedPokemon(dataSource);
    console.log('Seed completed successfully!');
  } catch (error) {
    console.error('Error during seeding:', error);
    throw error;
  }
};

