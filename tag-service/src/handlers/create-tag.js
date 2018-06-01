import "../aws-cloudwatch-retry";
import withErrorHandling from "lambda-error-handler";
import withWriteAuthorization from "../with-write-authorization";
import * as tagService from "../tag-service";

async function handlerImpl(event) {
  const request = {
    type: event.pathParameters.type,
    label: JSON.parse(event.body).label
  };

  const result = await tagService.createTag(request);

  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*"
    },
    body: JSON.stringify(result)
  };
}

export const handler = withWriteAuthorization(withErrorHandling(handlerImpl));
