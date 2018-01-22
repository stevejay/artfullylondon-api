'use strict';

const co = require('co');
const pageLoader = require('../../venue-processing/page-loader').staticLoader;

const BASE_URL = 'http://www.gimpelfils.com';

module.exports.pageFinder = co.wrap(function*() {
  const $ = yield pageLoader(
    BASE_URL + '/pages/exhibitions/exhibitionindex.php'
  );
  const result = [];

  $('#content a').each(function() {
    const href = $(this).attr('href');

    if (href && href.startsWith('exhibition.php')) {
      result.push(BASE_URL + '/pages/exhibitions/' + href);
    }
  });

  return result.slice(0, 4);
});

module.exports.pageParser = co.wrap(function*(pageUrl) {
  const $ = yield pageLoader(pageUrl);
  const title = $('title').html();
  const data = $('#content').html();
  return { title, data };
});

module.exports.venueOpenings = co.wrap(function*() {
  const $ = yield pageLoader(BASE_URL + '/pages/contactvisit/contactvisit.php');
  return $('#content').html();
});
