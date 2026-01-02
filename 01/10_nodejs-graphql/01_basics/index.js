import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { schema } from './src/graphql/schema.js';
import { resolver } from './src/graphql/resolvers.js';

const server = new ApolloServer({
  typeDefs: schema,
  resolvers: resolver,
});

const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
});

console.log(`🚀  Server ready at: ${url}`);
