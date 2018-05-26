'use strict';

const co = require('co');
const pageLoader = require('../../venue-processing/page-loader').staticLoader;

const BASE_URL = 'https://www.somersethouse.org.uk';

exports.pageFinder = co.wrap(function*() {
  const result = [];
  let pageNo = 0;

  while (true) {
    const url = `${BASE_URL}/whats-on?page=${pageNo}`;
    const $ = yield pageLoader(url);
    const links = $('.view-content .field-content > a:has(img)');

    if (links.length === 0) {
      break;
    }

    links.each(function() {
      const href = $(this).attr('href');
      result.push(BASE_URL + href);
    });

    ++pageNo;
  }

  return result;
});

exports.pageParser = co.wrap(function*(pageUrl) {
  const $ = yield pageLoader(pageUrl);
  const title = $('h1.node__title').html();
  const data = $('.l-content').html();
  return { title, data };
});

exports.venueOpenings = co.wrap(function*() {
  const $ = yield pageLoader(BASE_URL + '/opening-times-prices');
  return $('.group-main-content .content').html();
});
