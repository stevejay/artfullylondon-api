'use strict';

const pageLoader = require('../../venue-processing/page-loader').staticLoader;

const BASE_URL = 'https://www.bac.org.uk';

exports.pageFinder = async function() {
  const result = [];

  const $ = await pageLoader(
    BASE_URL + '/content_category/3262/whats_on/whats_on'
  );

  $('a:has(img)').each(function() {
    const href = $(this).attr('href');

    if (href.startsWith('/events/')) {
      result.push(BASE_URL + href);
    }
  });

  return result;
};

exports.pageParser = async function(pageUrl) {
  const $ = await pageLoader(pageUrl);
  const title = $('title').html();

  const data = $(
    'body > .container .row:first-of-type .col-sm-8:first-of-type'
  ).html();

  return { title, data };
};
