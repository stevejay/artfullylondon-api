import "./xray-setup";
import withErrorHandling from "lambda-error-handler";
import withCacheControl from "./with-cache-control";
import * as searchService from "../search-service";
import * as mapper from "./mapper";
import convertAsyncToCallback from "./convert-async-to-callback";

export const handler = convertAsyncToCallback(
  withErrorHandling(
    withCacheControl(async function(event) {
      const request = mapper.mapAutocompleteSearchEvent(event);
      const result = await searchService.autocompleteSearch(request);
      return mapper.mapResponse(result);
    })
  )
);
