import "./xray-setup";
import _ from "lodash";
import { ApolloServer } from "apollo-server-lambda";
import typeDefs from "../type-defs";
import resolvers from "../resolvers";

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ event }) => ({
    authorizer: _.get(event, "requestContext.authorizer") || {}
  })
});

export const graphqlHandler = server.createHandler({
  cors: { origin: "*", credentials: true }
});
