import dynamodb from "./dynamodb";

const BASIC_REQUEST = {
  TableName: process.env.SERVERLESS_ITERATION_LOG_TABLE_NAME,
  ReturnConsumedCapacity: process.env.RETURN_CONSUMED_CAPACITY
};

export async function createLog(actionId, iterationId) {
  await dynamodb.put({
    ...BASIC_REQUEST,
    Item: { actionId, iterationId, errors: [], completed: false },
    ConditionExpression: "attribute_not_exists(completed)"
  });
}

export async function addErrorToLog(actionId, iterationId, message) {
  await dynamodb.update({
    ...BASIC_REQUEST,
    Key: { actionId, iterationId },
    UpdateExpression: "SET errors = list_append(errors, :message)",
    ConditionExpression:
      "attribute_exists(actionId) and attribute_exists(iterationId)",
    ExpressionAttributeValues: {
      ":message": [message]
    }
  });
}

export async function closeLog(actionId, iterationId) {
  await dynamodb.update({
    ...BASIC_REQUEST,
    Key: { actionId, iterationId },
    UpdateExpression: "SET completed = :completed",
    ConditionExpression:
      "attribute_exists(actionId) and attribute_exists(iterationId)",
    ExpressionAttributeValues: {
      ":completed": true
    }
  });
}
