"use strict";

const elasticsearch = require("elasticsearch");

const client = new elasticsearch.Client({
  host: process.env.ELASTICSEARCH_HOST,
  log: "error"
});

module.exports = exports = {
  bulk: params =>
    new Promise((resolve, reject) => {
      client.bulk(params, (err, response) => {
        if (err) {
          reject(err);
        } else if (response.errors) {
          reject(new Error(JSON.stringify(response)));
        } else {
          resolve(response);
        }
      });
    })
};
