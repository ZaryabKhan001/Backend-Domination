import { ApolloServer } from '@apollo/server';
import { graphQLSchema } from './schema/schema.js';
import { graphQLResolver } from './resolvers/resolver.js';

export const connectGraphQl = () => {
  const server = new ApolloServer({
    typeDefs: graphQLSchema,
    resolvers: graphQLResolver,
  });
  return server;
};
