import clientWrapper from "dynamodb-doc-client-wrapper";

const config = process.env.IS_OFFLINE || process.env.NODE_ENV === "test"
  ? {
      connection: {
        region: "localhost",
        endpoint: process.env.DYNAMODB_HOST
      }
    }
  : null;

export default clientWrapper(config);
