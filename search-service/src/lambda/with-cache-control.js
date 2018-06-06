import * as mapper from "./mapper";

const CACHE_CONTROL_SECONDS = 1800;

export default function(handler) {
  return async function(event, context) {
    const response = await handler(event, context);
    const request = mapper.mapRouteType(event);

    if (request.isPublic) {
      response.headers[
        "cache-control"
      ] = `public, max-age=${CACHE_CONTROL_SECONDS}`;
    }

    return response;
  };
}
