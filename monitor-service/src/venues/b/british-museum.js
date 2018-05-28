'use strict';

const pageLoader = require('../../venue-processing/page-loader').staticLoader;

const BASE_URL = 'http://www.britishmuseum.org';

exports.pageFinder = async function() {
  const result = [];
  const $ = await pageLoader(BASE_URL + '/whats_on.aspx');

  $('h2 ~ div a:has(img)').each(function() {
    const href = $(this).attr('href');

    if (href.startsWith('http://www.britishmuseum.org/')) {
      result.push(href);
    }
  });

  return result;
};

exports.pageParser = async function(pageUrl) {
  const $ = await pageLoader(pageUrl);
  const title = $('title').html();

  const data = $('#mainContent p').each(function() {
    $(this).html();
  });

  return { title, data };
};

exports.venueOpenings = async function() {
  const $ = await pageLoader(BASE_URL + '/visiting/opening_times.aspx');
  return $('.container .grid_6').html();
};
