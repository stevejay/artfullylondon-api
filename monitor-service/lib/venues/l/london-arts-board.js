'use strict';

const co = require('co');
const pageLoader = require('../../venue-processing/page-loader').spaLoader;

exports.pageParser = co.wrap(function*() {
  const $ = yield pageLoader(
    'http://londonartsboard.blogspot.co.uk/search/label/Current%20Exhibition',
    '.article-content'
  );

  const data = $('.article-content').html();
  return { data };
});
