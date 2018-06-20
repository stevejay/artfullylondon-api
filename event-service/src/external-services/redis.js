import * as redis from "redis";
import * as xrayWrapper from "./xray-wrapper";

const CLIENT_OPTIONS = {
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  password: process.env.REDIS_PASSWORD
};

let client = null;

function connect() {
  return new Promise((resolve, reject) => {
    if (client) {
      resolve();
    } else {
      client = redis.createClient(CLIENT_OPTIONS);
      client.on("ready", () => resolve());
      client.on("error", reject);
    }
  });
}

function disconnect() {
  if (client) {
    client.quit();
    client = null;
  }
}

export function get(key) {
  return new Promise((resolve, reject) => {
    xrayWrapper.captureAsyncFunc("redis get", subsegment => {
      connect()
        .then(
          () =>
            new Promise((resolve, reject) => {
              client.get(key, (err, response) => {
                if (err) {
                  reject(err);
                } else {
                  resolve(response ? response.toString() : null);
                }
              });
            })
        )
        .then(response => {
          disconnect();
          subsegment.close();
          resolve(response);
        })
        .catch(err => {
          disconnect();
          subsegment.close(err);
          reject(err);
        });
    });
  });
}

export function set(key, value) {
  return new Promise((resolve, reject) => {
    xrayWrapper.captureAsyncFunc("redis set", subsegment => {
      connect()
        .then(
          () =>
            new Promise((resolve, reject) => {
              client.set(key, value, err => {
                if (err) {
                  reject(err);
                } else {
                  resolve();
                }
              });
            })
        )
        .then(() => {
          disconnect();
          subsegment.close();
          resolve();
        })
        .catch(err => {
          subsegment.close(err);
          reject(err);
        });
    });
  });
}
