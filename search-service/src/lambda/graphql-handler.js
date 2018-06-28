import "./xray-setup";
// import _ from "lodash";
import { ApolloServer } from "apollo-server-lambda";
import typeDefs from "./schema.gql";
import resolvers from "./resolvers";

const server = new ApolloServer({ typeDefs, resolvers });

export const handler = server.createHandler({
  cors: { origin: "*", credentials: true }
});

// export function handler(event, context, callback) {
//   return serverHandler(event, context, (error, response) => {
//     // TODO work out best way to indicate no caching ("no-cache")
//     response.headers["Cache-Control"] = "public, max-age=1800";
//     callback(error, response);
//   });
// }
