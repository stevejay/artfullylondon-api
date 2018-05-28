'use strict';


const pageLoader = require('../../venue-processing/page-loader').staticLoader;

const BASE_URL = 'http://www.lionandunicorntheatre.co.uk';

exports.pageFinder = async function() {
  const $ = await pageLoader(BASE_URL + '/');
  const result = [];

  $('figure > a:has(img)').each(function() {
    const href = $(this).attr('href');

    if (href.startsWith('http')) {
      result.push(href);
    }
  });

  return result;
};

exports.pageParser = async function(pageUrl) {
  const $ = await pageLoader(pageUrl);
  const title = $('title').html();
  const data = $('#tz-main-body-wrapper').html();
  return { title, data };
};
