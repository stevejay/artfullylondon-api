import "./xray-setup";
import { ApolloServer } from "apollo-server-lambda";
import { mergeSchemas } from "graphql-tools";
import dataServiceSchema from "./data-service-schema";
import searchServiceSchema from "./search-service-schema";
import userServiceSchema from "./user-service-schema";

const schema = mergeSchemas({
  schemas: [dataServiceSchema(), searchServiceSchema(), userServiceSchema()]
});

const server = new ApolloServer({
  schema,
  context: ({ event }) => ({
    authorization: event.headers["Authorization"]
  })
});

export const handler = server.createHandler({
  cors: { origin: "*", credentials: true }
});
