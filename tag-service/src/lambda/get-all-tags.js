import withErrorHandling from "lambda-error-handler";
import * as tagService from "../tag-service";
import * as mapper from "./mapper";

export const handler = withErrorHandling(async function() {
  const result = await tagService.getAllTags();
  return mapper.mapLambdaResponse(result);
});
