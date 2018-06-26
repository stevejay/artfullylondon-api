import "./xray-setup";
// import withErrorHandling from "./with-error-handling";
// import convertAsyncToCallback from "./convert-async-to-callback";
import { graphqlLambda, graphiqlLambda } from "apollo-server-lambda";
import { makeExecutableSchema } from "graphql-tools";
import { schema } from "../schema";
import { resolvers } from "../resolvers";

const graphQLSchema = makeExecutableSchema({
  typeDefs: schema,
  resolvers
});

export function graphqlHandler(event, context, cb) {
  graphqlLambda({ schema: graphQLSchema })(event, context, (err, result) => {
    cb(err, {
      ...result,
      headers: {
        ...result.headers,
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": "true"
      }
    });
  });
}

export const graphiqlHandler = graphiqlLambda({ endpointURL: "/graphql" });

// export const handler = convertAsyncToCallback(
//   withErrorHandling(async function(event) {
//     return { body: JSON.stringify({ foo: "bar" }) };
//   })
// );
