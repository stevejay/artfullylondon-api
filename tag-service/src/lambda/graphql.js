import { ApolloServer } from "apollo-server-lambda";
import typeDefs from "../type-defs";
import resolvers from "../resolvers";

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ event, context }) => ({
    headers: event.headers,
    functionName: context.functionName,
    event,
    context
  })
});

export const graphqlHandler = server.createHandler({
  cors: {
    origin: true, // '*',
    credentials: true
  }
});
