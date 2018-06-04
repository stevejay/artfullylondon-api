import withErrorHandling from "lambda-error-handler";
import * as tagService from "../tag-service";
import * as mapper from "../mapper";

export const handler = withErrorHandling(async function(event) {
  const request = mapper.mapLambdaRequest(event);
  const result = await tagService.getTagsByType(request);
  return mapper.mapLambdaResponse(result);
});
