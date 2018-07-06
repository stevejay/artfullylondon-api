import { HttpLink } from "apollo-link-http";
import { setContext } from "apollo-link-context";
import fetch from "node-fetch";
import typeDefs from "../../image-service/src/schema.gql";
import { makeRemoteExecutableSchema } from "graphql-tools";

const httpLink = new HttpLink({
  uri: process.env.IMAGE_SERVICE_GRAPHQL_URI,
  fetch
});

const link = setContext((request, previousContext) => ({
  headers: {
    Authorization: previousContext.graphqlContext.authorization
  }
})).concat(httpLink);

export default function() {
  return makeRemoteExecutableSchema({
    schema: typeDefs,
    link
  });
}
