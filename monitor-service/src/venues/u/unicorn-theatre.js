'use strict';


const pageLoader = require('../../venue-processing/page-loader').staticLoader;

const BASE_URL = 'https://www.unicorntheatre.com';

exports.pageFinder = async function() {
  const result = [];
  const $ = await pageLoader(`${BASE_URL}/whatson`);

  $('li.production a').each(function() {
    const href = $(this).attr('href');

    if (href) {
      result.push(BASE_URL + href);
    }
  });

  return result;
};

exports.pageParser = async function(pageUrl) {
  const $ = await pageLoader(pageUrl);
  const title = $('title').html();
  const data = [$('#location').html(), $('#maincontent').html()];
  return { title, data };
};
