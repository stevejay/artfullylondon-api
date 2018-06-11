import jwtDecode from "jwt-decode";

export function isReadonlyUser(event) {
  const token = jwtDecode(event.headers.Authorization);
  return token["cognito:username"] === "readonly";
}
