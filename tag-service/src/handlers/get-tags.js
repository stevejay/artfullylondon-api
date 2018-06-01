import "../aws-cloudwatch-retry";
import withErrorHandling from "lambda-error-handler";
import * as tagService from "../tag-service";

async function handlerImpl(event) {
  const request = { tagType: event.pathParameters.type };
  const result = await tagService.getTagsByType(request);

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
