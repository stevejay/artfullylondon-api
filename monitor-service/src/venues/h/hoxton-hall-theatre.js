'use strict';

const co = require('co');
const pageLoader = require('../../venue-processing/page-loader').staticLoader;

const BASE_URL = 'https://www.hoxtonhall.co.uk';

exports.pageFinder = co.wrap(function*() {
  const result = [];
  const eventSelector = '.content_section .post_block a:has(img)';

  let $ = yield pageLoader(BASE_URL + '/category/whatson/dance/');
  $(eventSelector).each(function() {
    const href = $(this).attr('href');
    result.push(href);
  });

  $ = yield pageLoader(BASE_URL + '/category/whatson/theatre/');
  $(eventSelector).each(function() {
    const href = $(this).attr('href');
    result.push(href);
  });

  $ = yield pageLoader(BASE_URL + '/category/whatson/events/');
  $(eventSelector).each(function() {
    const href = $(this).attr('href');
    result.push(href);
  });

  return result;
});

exports.pageParser = co.wrap(function*(pageUrl) {
  const $ = yield pageLoader(pageUrl);
  const title = $('.left_content h1.post_title').html();

  const data = $('#content .left_content p').each(function() {
    $(this).html();
  });

  return { title, data };
});
