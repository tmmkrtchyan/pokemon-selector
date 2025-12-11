/* eslint-disable */

import axios from 'axios';

module.exports = async function () {
  // Configure axios for tests to use.
  const host = process.env.HOST ?? 'localhost';
  const port = process.env.PORT ?? '3000';
  const baseURL = `http://${host}:${port}`;
  axios.defaults.baseURL = baseURL;

  // Store GraphQL endpoint for tests
  globalThis.__GRAPHQL_ENDPOINT__ = `${baseURL}/graphql`;
};
