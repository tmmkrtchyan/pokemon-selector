import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';
import { appConfig } from '../../config/app.config';

const config = appConfig();
const httpLink = new HttpLink({
  uri: config.graphqlEndpoint,
});

export const apolloClient = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});

