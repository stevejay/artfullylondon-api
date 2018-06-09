import request from "request-promise-native";

const API_HOST = "http://localhost:3013";

export function get(path) {
  return request({
    uri: `${API_HOST}${path}`,
    json: true,
    method: "GET",
    timeout: 30000
  });
}