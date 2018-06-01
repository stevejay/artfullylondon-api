import clientWrapper from "dynamodb-doc-client-wrapper";

const config = process.env.IS_OFFLINE
  ? {
      connection: {
        region: "localhost",
        endpoint: "http://localhost:4569"
      }
    }
  : null;

export const dynamodb = clientWrapper(config);
