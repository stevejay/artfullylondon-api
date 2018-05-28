'use strict';

const pageLoader = require('../../venue-processing/page-loader').staticLoader;

exports.pageParser = async function() {
  const $ = await pageLoader('http://anthonyreynolds.com/current.html');

  const websiteUnderConstruction =
    $('h4:contains("website update in progress")').get().length > 0;

  if (websiteUnderConstruction) {
    return { data: 'website update in progress' };
  }

  const data = $('.container:has(h4:contains("press release")) .row')
    .first()
    .html();

  return { data };
};
