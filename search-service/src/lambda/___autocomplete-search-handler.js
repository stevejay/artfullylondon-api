import "./xray-setup";
import withErrorHandling from "./___with-error-handling";
import * as searchService from "../search-service";
import * as mapper from "./___mapper";
import convertAsyncToCallback from "./___convert-async-to-callback";

export const handler = convertAsyncToCallback(
  withErrorHandling(async function(event) {
    const response = await searchService.autocompleteSearch(event);
    return mapper.mapResponse(response, event);
  })
);
