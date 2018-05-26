'use strict';

const co = require('co');
const pageLoader = require('../../venue-processing/page-loader').staticLoader;

const BASE_URL = 'https://www.richmix.org.uk';

exports.pageFinder = co.wrap(function*() {
  const result = [];
  const mediums = ['exhibitions', 'spoken-word', 'dance', 'theatre', 'family'];

  for (let i = 0; i < mediums.length; ++i) {
    const $ = yield pageLoader(`${BASE_URL}/events/type/${mediums[i]}`);

    $('#content a:has(img)').each(function() {
      const href = $(this).attr('href');
      result.push(BASE_URL + href);
    });
  }

  return result;
});

exports.pageParser = co.wrap(function*(pageUrl) {
  const $ = yield pageLoader(pageUrl);
  const title = $('#page-title').html();
  const data = [$('#content article').html()];
  return { title, data };
});
