import * as redis from "redis";

const CLIENT_OPTIONS = {
  host: "redis-16348.c3.eu-west-1-2.ec2.cloud.redislabs.com",
  port: 16348,
  password: "5WgjfzcZoJVmgeZt6V92bCJTN36h2GlB"
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

export function flushAll() {
  return connect()
    .then(
      () =>
        new Promise((resolve, reject) => {
          client.flushall((err, response) => {
            if (err) {
              reject(err);
            } else {
              resolve();
            }
          });
        })
    )
    .then(() => disconnect())
    .catch(err => {
      disconnect();
      throw err;
    });
}

export function get(entityType, id) {
  return connect()
    .then(
      () =>
        new Promise((resolve, reject) => {
          client.get(`${entityType}/${id}`, (err, response) => {
            if (err) {
              reject(err);
            } else {
              resolve(response ? response.toString() : null);
            }
          });
        })
    )
    .then(() => disconnect())
    .catch(err => {
      disconnect();
      throw err;
    });
}
