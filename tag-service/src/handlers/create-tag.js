import withErrorHandling from "lambda-error-handler";
import withWriteAuthorization from "./with-write-authorization";
import * as tagService from "../tag-service";
import * as mapper from "../mapper";

export const handler = withWriteAuthorization(
  withErrorHandling(async function(event) {
    const request = mapper.mapLambdaRequest(event);
    const result = await tagService.createTag(request);
    return mapper.mapLambdaResponse(result);
  })
);
