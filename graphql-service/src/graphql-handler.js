import "./xray-setup";
import { ApolloServer } from "apollo-server-lambda";
import { mergeSchemas } from "graphql-tools";
import tagServiceSchema from "./tag-service-schema";

const schema = mergeSchemas({
  schemas: [tagServiceSchema()]
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
