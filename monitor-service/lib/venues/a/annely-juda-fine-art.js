'use strict';

const co = require('co');
const pageLoader = require('../../venue-processing/page-loader').staticLoader;

module.exports.pageFinder = co.wrap(function*() {
  const result = [];

  let $ = yield pageLoader(
    'http://www.annelyjudafineart.co.uk/exhibitions/current'
  );
  $('#current-exhibitions a').each(function() {
    const href = $(this).attr('href');
    result.push(href);
  });

  $ = yield pageLoader(
    'http://www.annelyjudafineart.co.uk/exhibitions/forthcoming'
  );
  $('ul.forthcoming-exhibitions a').each(function() {
    const href = $(this).attr('href');
    result.push('http://www.annelyjudafineart.co.uk' + href);
  });

  return result;
});

module.exports.pageParser = co.wrap(function*(pageUrl) {
  const $ = yield pageLoader(pageUrl);
  const title = $('h1').html();
  const data = $('#main-content .text-panel').html();
  return { title, data };
});

module.exports.venueOpenings = co.wrap(function*() {
  const $ = yield pageLoader('http://www.annelyjudafineart.co.uk/about');
  return $('.opening-hours').html();
});
