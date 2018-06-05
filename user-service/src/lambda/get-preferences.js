import withErrorHandling from "lambda-error-handler";
import * as preferenceService from "../preference-service";
import * as mapper from "./mapper";

export const handler = withErrorHandling(async function(event) {
  const request = mapper.mapBasicRequest(event);
  const result = await preferenceService.getPreferences(request);
  return mapper.mapResponse(result);
});
