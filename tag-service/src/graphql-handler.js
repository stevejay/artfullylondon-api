import "./xray-setup";
import _ from "lodash";
import { ApolloServer } from "apollo-server-lambda";
import typeDefs from "./schema.gql";
import resolvers from "./resolvers";

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ event }) => ({
    authorizer: _.get(event, "requestContext.authorizer") || {}
  })
});

export const handler = server.createHandler({
  cors: { origin: "*", credentials: true }
});
