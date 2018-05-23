"use strict";
"use strict";

module.exports = () => {
  const redis = require("redis");

  const redisOptions = {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASSWORD
  };

  const client = redis.createClient(redisOptions);

  return {
    waitForReady: () =>
      new Promise(resolve => client.on("ready", () => resolve())),
    get: key =>
      new Promise(resolve => {
        client.get(key, (err, response) => {
          if (err) {
            resolve(err);
          } else {
            resolve(response ? response.toString() : null);
          }
        });
      }),
    set: (key, value) =>
      new Promise(resolve => {
        client.set(key, value, err => {
          if (err) {
            resolve(err);
          } else {
            resolve();
          }
        });
      }),
    quit: () => client.quit()
  };
};
