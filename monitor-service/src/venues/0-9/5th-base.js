'use strict';

const co = require('co');
const pageLoader = require('../../venue-processing/page-loader').spaLoader;

exports.pageParser = co.wrap(function*() {
  let $ = yield pageLoader(
    'http://www.5thbase.co.uk/forthcoming',
    '#PAGES_CONTAINER'
  );

  const data = [$('#PAGES_CONTAINER').html()];

  $ = yield pageLoader('http://www.5thbase.co.uk/', '#PAGES_CONTAINER');
  data.push($('#PAGES_CONTAINER').html());

  return { data };
});
