'use strict';


const pageLoader = require('../../venue-processing/page-loader').staticLoader;

const BASE_URL = 'http://www.iwm.org.uk';

exports.pageFinder = async function() {
  const $ = await pageLoader(BASE_URL + '/visits/iwm-london/exhibitions');
  const result = [];

  $('#content h2.field-content > a').each(function() {
    const href = $(this).attr('href');
    result.push(BASE_URL + href);
  });

  return result;
};

exports.pageParser = async function(pageUrl) {
  const $ = await pageLoader(pageUrl);
  const title = $('.page-title').html();
  const data = $('#content').html();
  return { title, data };
};

exports.venueOpenings = async function() {
  const $ = await pageLoader(BASE_URL + '/visits/iwm-london/your-visit');
  return $('#content .onecolumn ul').html();
};
