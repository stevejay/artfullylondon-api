import withErrorHandling from "lambda-error-handler";
import * as userService from "../user-service";
import * as mapper from "./mapper";

export const handler = withErrorHandling(async function(event) {
  const request = mapper.mapBasicRequest(event);
  const result = await userService.deleteUser(request);
  return mapper.mapResponse(result);
});
