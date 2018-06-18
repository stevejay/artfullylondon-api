import clientWrapper from "dynamodb-doc-client-wrapper";

const config = process.env.IS_OFFLINE
  ? {
      connection: {
        region: "localhost",
        endpoint: process.env.DYNAMODB_HOST
      }
    }
  : null;

export default clientWrapper(config);
