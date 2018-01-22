'use strict';

const expect = require('chai').expect;

module.exports = (exports = (handler, event, expected, done) => {
  return new Promise((resolve, reject) => {
    try {
      handler(event, null, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    } catch (err) {
      reject(err);
    }
  })
    .then(result => {
      if (result.body) {
        result.body = JSON.parse(result.body);
      }

      expect(result).to.eql(expected);
      done();
    })
    .catch(err => done(err));
});
