'use strict';


const pageLoader = require('../../venue-processing/page-loader').staticLoader;

const BASE_URL = 'http://www.estorickcollection.com';

exports.pageFinder = async function() {
  const result = [];

  let $ = await pageLoader(BASE_URL + '/events');
  $('.u-space--mb-s a').each(function() {
    const href = $(this).attr('href');

    if (href.startsWith('/events/')) {
      result.push(BASE_URL + href);
    }
  });

  $ = await pageLoader(BASE_URL + '/exhibitions/in-the/future');
  $('.u-space--mb-s a').each(function() {
    const href = $(this).attr('href');

    if (href.startsWith('/exhibitions/')) {
      result.push(BASE_URL + href);
    }
  });

  return result;
};

exports.pageParser = async function(pageUrl) {
  const $ = await pageLoader(pageUrl);
  const title = $('h1').html();
  const data = $('main p').html();
  return { title, data };
};

exports.venueOpenings = async function() {
  const $ = await pageLoader(BASE_URL + '/visitor-information');
  return $('main h3:contains("Opening Times") + p').html();
};
