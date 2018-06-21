import * as request from "request-promise-native";
import * as xrayWrapper from "./xray-wrapper";

export function get(url, traceName = "http get") {
  return new Promise((resolve, reject) => {
    xrayWrapper.captureAsyncFunc(traceName, subsegment => {
      request
        .get(url, { json: true })
        .then(response => {
          subsegment.close();
          resolve(response);
        })
        .catch(err => {
          subsegment.close(err);
          reject(err);
        });
    });
  });
}
