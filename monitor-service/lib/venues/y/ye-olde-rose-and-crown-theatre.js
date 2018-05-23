'use strict';

const co = require('co');
const pageLoader = require('../../venue-processing/page-loader').staticLoader;

const BASE_URL = 'http://www.yeolderoseandcrowntheatrepub.co.uk';

exports.pageFinder = co.wrap(function*() {
  const result = [];
  let $ = yield pageLoader(`${BASE_URL}/index.php/in-the-theatre/`);

  $('.main a:contains("More Info")').each(function() {
    const href = $(this).attr('href');
    result.push(href);
  });

  return result;
});

exports.pageParser = co.wrap(function*(pageUrl) {
  const $ = yield pageLoader(pageUrl);
  const title = $('.cro_title').html();
  const data = [$('.singlepage').html()];
  return { title, data };
});
