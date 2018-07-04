import * as auth from "./___auth";

export default function(handler) {
  return async function(event, context) {
    if (auth.isReadonlyUser(event)) {
      throw new Error("[401] readonly user cannot modify system");
    }

    return await handler(event, context);
  };
}
