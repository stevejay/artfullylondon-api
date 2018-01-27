'use strict';

const request = require('request');
const fs = require('fs');

module.exports.downloadFile = (url, filePath) => {
  return new Promise((resolve, reject) => {
    request
      .get(url)
      .on('error', reject)
      .on('response', response => {
        if (response.statusCode !== 200) {
          reject(new Error(`Download file response code was ${response.statusCode}`));
        }
      })
      .pipe(fs.createWriteStream(filePath))
      .on('finish', () => resolve())
      .on('error', reject);
  });
};

module.exports.readFile = filePath => {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
};

module.exports.writeFile = (filePath, content) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(filePath, content, err => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};

module.exports.deleteFile = filePath => {
  return new Promise(resolve => {
    fs.unlink(filePath, () => resolve());
  });
};
