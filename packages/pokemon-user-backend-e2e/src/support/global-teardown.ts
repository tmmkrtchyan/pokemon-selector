/* eslint-disable */

module.exports = async function () {
  // Put clean up logic here (e.g. stopping services, docker-compose, etc.).
  // Hint: `globalThis` is shared between setup and teardown.
  console.log(globalThis.__TEARDOWN_MESSAGE__);

  // Close the NestJS application
  if (globalThis.__APP__) {
    await globalThis.__APP__.close();
    console.log('Application closed');
  }

  // Stop and remove the database container
  if (globalThis.__DB_CONTAINER__) {
    try {
      await globalThis.__DB_CONTAINER__.stop();
      console.log('Database container stopped and removed');
    } catch (error) {
      console.warn('Failed to stop database container:', error);
    }
  }
};
