import withErrorHandling from "lambda-error-handler";
import withCacheControl from "./with-cache-control";
import * as searchService from "../search-service";
import * as mapper from "./mapper";

export const handler = withErrorHandling(
  withCacheControl(async function(event) {
    const request = mapper.mapPresetSearchEvent(event);
    const result = await searchService.presetSearch(request);
    return mapper.mapResponse(result);
  })
);
