'use strict';

const co = require('co');
const pageLoader = require('../../venue-processing/page-loader').staticLoader;

const BASE_URL = 'https://www.youngvic.org';

module.exports.pageFinder = co.wrap(function*() {
  const result = [];
  let $ = yield pageLoader(`${BASE_URL}/index.php/whats-on`);

  $('.whats-on a:has(img)').each(function() {
    let href = $(this).attr('href');
    href = BASE_URL + href;
    result.push(href);
  });

  return result;
});

module.exports.pageParser = co.wrap(function*(pageUrl) {
  const $ = yield pageLoader(pageUrl);
  const title = $('head meta[name="title"]').html();
  const data = [];

  $('#block-mainpagecontent').each(function() {
    data.push($(this).html());
  });

  return { title, data };
});
