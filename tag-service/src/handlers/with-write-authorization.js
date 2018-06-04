import * as mapper from "../mapper";
import * as auth from "../auth";

export default function(handler) {
  return async function(event, context) {
    return auth.isReadonlyUser(event)
      ? mapper.mapLambdaResponse(
          { error: "[401] readonly user cannot modify system" },
          401
        )
      : await handler(event, context);
  };
}
