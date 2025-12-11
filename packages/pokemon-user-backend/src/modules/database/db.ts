import { PostgreSqlContainer, StartedPostgreSqlContainer } from '@testcontainers/postgresql';

export const postgresContainer = new PostgreSqlContainer()
  .withDatabase('pokemon')
  .withUsername('admin')
  .withPassword('admin')
  .withExposedPorts({
    container: 5432,
    host: 5432,
  })
  .withReuse();

export const startDatabase = async (): Promise<StartedPostgreSqlContainer> => {
  const theContainer = await postgresContainer.start();
  process.on('SIGINT', async function () {
    await theContainer.stop();
    process.exit();
  });
  return theContainer;
};
