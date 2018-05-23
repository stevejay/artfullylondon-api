'use strict';

const co = require('co');
const pageLoader = require('../../venue-processing/page-loader').staticLoader;

const BASE_URL = 'http://www.stratfordeast.com';

exports.pageFinder = co.wrap(function*() {
  const result = [];
  const categories = ['drama', 'dance', 'concert', 'panto', 'musicals'];

  for (let i = 0; i < categories.length; ++i) {
    const url = `${BASE_URL}/whats-on/${categories[i]}`;
    const $ = yield pageLoader(url);

    $('li.Exhib a:has(img)').each(function() {
      const href = $(this).attr('href');
      result.push(BASE_URL + href);
    });
  }

  return result;
});

exports.pageParser = co.wrap(function*(pageUrl) {
  const $ = yield pageLoader(pageUrl);
  const title = $('section.container h2').html();
  const data = $('section.container').html();
  return { title, data };
});
