export function getFromEvent(event) {
  const header = event.headers.Authorization;
  if (!header) {
    throw new Error("No Authorization header found");
  }
  return header.replace(/^Bearer /, "");
}
