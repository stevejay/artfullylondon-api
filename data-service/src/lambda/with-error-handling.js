export default function(handler) {
  return async function(event, context) {
    try {
      return await handler(event, context);
    } catch (err) {
      const errorCodeMatch = (err.message || "").match(/^\[500\]/);
      if (!errorCodeMatch) {
        err.message = "[500] " + (err.message || "Unknown error");
      }

      throw err;
    }
  };
}
