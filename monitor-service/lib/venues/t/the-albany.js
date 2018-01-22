'use strict';

const co = require('co');
const pageLoader = require('../../venue-processing/page-loader').staticLoader;

const BASE_URL = 'http://www.thealbany.org.uk';

module.exports.pageFinder = co.wrap(function*() {
  const result = [];
  const $ = yield pageLoader(`${BASE_URL}/whatson`);

  $('.eventlistbox a:has(img)').each(function() {
    const href = $(this).attr('href');
    result.push(href);
  });

  return result;
});

module.exports.pageParser = co.wrap(function*(pageUrl) {
  const $ = yield pageLoader(pageUrl);
  const title = $('title').html();
  const data = [$('#maincontentright').html()];

  $('.eventcontentright > p').map(function() {
    data.push($(this).html());
  });

  return { title, data };
});
