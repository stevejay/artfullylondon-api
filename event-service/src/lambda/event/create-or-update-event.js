import "../xray-setup";
import withErrorHandling from "../___with-error-handling";
import withWriteAuthorization from "../___with-write-authorization";
import * as eventService from "../../event-service";
import convertAsyncToCallback from "../convert-async-to-callback";

export const handler = convertAsyncToCallback(
  withWriteAuthorization(
    withErrorHandling(async function(event) {
      const result = await eventService.createOrUpdate({
        ...event.body,
        id: event.id
      });
      return { body: JSON.stringify(result) };
    })
  )
);
