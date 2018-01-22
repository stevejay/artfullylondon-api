'use strict';

const co = require('co');
const pageLoader = require('../../venue-processing/page-loader').staticLoader;

const BASE_URL = 'https://www.orangetreetheatre.co.uk';

module.exports.pageFinder = co.wrap(function*() {
  const result = [];
  const $ = yield pageLoader(`${BASE_URL}/whats-on`);

  $('#project-list a').each(function() {
    const href = $(this).attr('href');
    result.push(href);
  });

  return result;
});

module.exports.pageParser = co.wrap(function*(pageUrl) {
  const $ = yield pageLoader(pageUrl);
  const title = $('#project-item .show-item-title').html();
  const data = [$('#project-item .show-item-header').html()];

  $('#project-item .content-area p').each(function() {
    data.push($(this).html());
  });

  return { title, data };
});
