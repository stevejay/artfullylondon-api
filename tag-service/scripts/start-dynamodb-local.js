const dynamodbLocal = require("dynamodb-localhost");
dynamodbLocal.start({ port: 8000, sharedDb: true });
