'use strict';

const co = require('co');
const pageLoader = require('../../venue-processing/page-loader').spaLoader;

const BASE_URL = 'http://www.richardyounggallery.co.uk';

module.exports.pageFinder = co.wrap(function*() {
  const result = [];

  const $ = yield pageLoader(
    `${BASE_URL}/exhibitions`,
    '.current-exhibition-wrapper'
  );

  $('.current-exhibition-wrapper a:has(img)').each(function() {
    const href = $(this).attr('href');
    result.push(BASE_URL + href);
  });

  return result;
});

module.exports.pageParser = co.wrap(function*(pageUrl) {
  const $ = yield pageLoader(pageUrl, '.section-exhibition');
  const title = $('.section-exhibition .exhibition-title-wrapper').html();
  const data = [$('.section-exhibition .content-container').html()];
  return { title, data };
});

module.exports.venueOpenings = co.wrap(function*() {
  const $ = yield pageLoader(BASE_URL + '/contact');
  return $('.gallery-hours-wrapper').html();
});
