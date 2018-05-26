'use strict';

const co = require('co');
const pageLoader = require('../../venue-processing/page-loader').staticLoader;

exports.pageParser = co.wrap(function*() {
  const $ = yield pageLoader(
    'http://www.mercerchance.co.uk/exhibitions/4586074953'
  );
  const data = [];

  $('img[alt]').each(function() {
    const alt = $(this).attr('alt');
    data.push(alt);
  });

  return { data };
});
