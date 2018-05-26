'use strict';

const co = require('co');
const delay = require('delay');
const pageLoader = require('../../venue-processing/page-loader').staticLoader;

const BASE_URL = 'http://www.kingsplace.co.uk';

exports.pageFinder = co.wrap(function*() {
  const result = [];

  for (let i = 0; i < 15; ++i) {
    const $ = yield pageLoader(BASE_URL + `/whats-on?page=${i}`);
    let linkCount = 0;

    $('.views-wrap h2 > a').each(function() {
      const href = $(this).attr('href');

      if (
        href.startsWith('/whats-on/') &&
        !href.startsWith('/whats-on/comedy/')
      ) {
        result.push(BASE_URL + href);
        ++linkCount;
      }
    });

    if (linkCount === 0) {
      break;
    }
  }

  return result.slice(0, 50); // TODO increase this sometime
});

exports.pageParser = co.wrap(function*(pageUrl) {
  const $ = yield pageLoader(pageUrl);
  const title = $('title').html();

  const data = [
    $('.pane-production-information').html(),
    $('.pane-content p').html(),
  ];

  yield delay(1000);
  return { title, data };
});
