import "../aws-cloudwatch-retry";
import withErrorHandling from "lambda-error-handler";
import * as tagService from "../tag-service";

async function handlerImpl() {
  const result = await tagService.getAllTags();

  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*"
    },
    body: JSON.stringify(result)
  };
}

export const handler = withErrorHandling(handlerImpl);
