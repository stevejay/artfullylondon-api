import "./xray-setup";
import { ApolloServer } from "apollo-server-lambda";
import typeDefs from "../schema.gql";
import resolvers from "../resolvers";

const server = new ApolloServer({ typeDefs, resolvers });

export const handler = server.createHandler({
  cors: { origin: "*", credentials: true }
});
