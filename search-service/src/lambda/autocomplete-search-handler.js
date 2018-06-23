import "./xray-setup";
import withErrorHandling from "./with-error-handling";
import * as searchService from "../search-service";
import * as mapper from "./mapper";
import convertAsyncToCallback from "./convert-async-to-callback";

export const handler = convertAsyncToCallback(
  withErrorHandling(async function(event) {
    const response = await searchService.autocompleteSearch(event);
    return mapper.mapResponse(response, event);
  })
);
