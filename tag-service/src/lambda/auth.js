import jwtDecode from "jwt-decode";

export function isReadonlyUser(event) {
  const token = jwtDecode(event.authorization);
  return token["cognito:username"] === "readonly";
}
