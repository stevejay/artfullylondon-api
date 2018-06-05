import withErrorHandling from "lambda-error-handler";
import * as watchService from "../watch-service";
import * as mapper from "./mapper";

export const handler = withErrorHandling(async function(event) {
  const request = mapper.mapUpdateWatchesRequest(event);
  const result = await watchService.updateWatches(request);
  return mapper.mapResponse(result);
});
