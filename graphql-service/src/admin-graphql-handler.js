import "./xray-setup";
import { ApolloServer } from "apollo-server-lambda";
import { mergeSchemas } from "graphql-tools";
import dataServiceSchema from "./data-service-schema";
import eventServiceSchema from "./event-service-schema";
import imageServiceSchema from "./image-service-schema";
import searchServiceSchema from "./search-service-schema";
import tagServiceSchema from "./tag-service-schema";

const schema = mergeSchemas({
  schemas: [
    dataServiceSchema(),
    eventServiceSchema(),
    imageServiceSchema(),
    searchServiceSchema(),
    tagServiceSchema()
  ]
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
