const ERROR_CODE_REGEX = /^\[(\d\d\d)\]/;

export default function(handler) {
  return async function(event, context) {
    try {
      return await handler(event, context);
    } catch (err) {
      if (err.code === "ConditionalCheckFailedException") {
        err.message = "[400] Stale Data";
      } else {
        const errorCodeMatch = (err.message || "").match(ERROR_CODE_REGEX);
        if (!errorCodeMatch) {
          err.message = "[500] " + (err.message || "Unknown error");
        }
      }

      throw err;
    }
  };
}
