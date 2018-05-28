'use strict';

const pageLoader = require('../../venue-processing/page-loader').staticLoader;

const BASE_URL = 'http://www.sbf.org.uk';

exports.pageFinder = async function() {
  const result = [];
  const $ = await pageLoader(BASE_URL + '/evening-programme');

  $('#about a').each(function() {
    const href = $(this).attr('href');

    if (href.includes('/theatreshows/')) {
      result.push(BASE_URL + href);
    }
  });

  return result;
};

exports.pageParser = async function(pageUrl) {
  const $ = await pageLoader(pageUrl);
  const title = $('title').html();
  const data = $('#about').html();
  return { title, data };
};
