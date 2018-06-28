import { HttpLink } from "apollo-link-http";
import fetch from "node-fetch";
import typeDefs from "../../data-service/src/schema.gql";
import { makeRemoteExecutableSchema } from "graphql-tools";

const link = new HttpLink({
  uri: process.env.DATA_SERVICE_GRAPHQL_URI,
  fetch
});

export default function() {
  return makeRemoteExecutableSchema({
    schema: typeDefs,
    link
  });
}
