export function mapResponse(response, event) {
  return {
    body: JSON.stringify(response),
    headers: {
      "Cache-Control": event.admin ? "no-cache" : "public, max-age=1800"
    }
  };
}
