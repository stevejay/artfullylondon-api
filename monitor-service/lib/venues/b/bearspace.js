'use strict';

const co = require('co');
const pageLoader = require('../../venue-processing/page-loader').spaLoader;

module.exports.pageParser = co.wrap(function*() {
  const $ = yield pageLoader(
    'https://www.bearspace.co.uk/upcoming',
    'span:contains("MORE")'
  );

  const title = $('title').text().trim();
  const data = [];

  $('#SITE_CONTAINER p').each(function() {
    data.push($(this).html());
  });

  return { data, title };
});
