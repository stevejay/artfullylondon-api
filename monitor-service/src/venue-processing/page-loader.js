"use strict";

const cheerio = require("cheerio");
const Horseman = require("node-horseman");
const request = require("request");
const constants = require("../constants");

const USER_AGENT =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36";

exports.staticLoader = function(url) {
  return new Promise((resolve, reject) => {
    var options = {
      url: url,
      headers: {
        "User-Agent": USER_AGENT
      }
    };

    request(options, (err, response, body) => {
      if (err) {
        reject(err);
      } else {
        resolve(cheerio.load(body));
      }
    });
  });
};

exports.spaLoader = async function(url, selector, timeout) {
  const horseman = new Horseman({
    phantomPath: constants.PHANTOMJS_BIN_PATH,
    timeout: timeout || 20000,
    ignoreSSLErrors: true
  });

  await horseman.open(url);

  if (selector) {
    await horseman.waitForSelector(selector);
  }

  const html = await horseman.html();
  await horseman.close();
  return cheerio.load(html);
};
