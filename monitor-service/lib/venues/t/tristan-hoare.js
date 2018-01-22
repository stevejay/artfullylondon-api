'use strict';

const co = require('co');
const pageLoader = require('../../venue-processing/page-loader').staticLoader;

const BASE_URL = 'http://tristanhoaregallery.co.uk';

module.exports.pageFinder = co.wrap(function*() {
  const result = [];
  const $ = yield pageLoader(`${BASE_URL}/exhibitions/`);

  $('section.article-grid article a:has(img)').each(function() {
    const href = $(this).attr('href');
    result.push(href);
  });

  return result.slice(0, 6);
});

module.exports.pageParser = co.wrap(function*(pageUrl) {
  const $ = yield pageLoader(pageUrl);
  const title = $('h1.entry-title').html();

  const data = [
    $('main article header h2').html(),
    $('main article header h1').html(),
    $('main article header p').html(),
    $('main article .entry-content').html(),
  ];

  return { title, data };
});

module.exports.venueOpenings = co.wrap(function*() {
  const $ = yield pageLoader(BASE_URL + '/contact/');
  return $('main article').html();
});
