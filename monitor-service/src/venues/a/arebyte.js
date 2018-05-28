'use strict';

const pageLoader = require('../../venue-processing/page-loader').staticLoader;

// Note: arebyte have updated their website but they don't seem to have
// any proper event info.

const BASE_URL = 'http://www.arebyte.com';

exports.pageFinder = async function() {
  const result = [];
  let $ = await pageLoader(`${BASE_URL}`);

  $('li.menuItem li.subMenuItem a:contains(\'current\')').each(function() {
    const href = $(this).attr('href');
    result.push(BASE_URL + href);
  });

  return result;
};

exports.pageParser = async function(pageUrl) {
  const $ = await pageLoader(pageUrl);
  const data = $('.page_current_2.title').html();
  return { data };
};
