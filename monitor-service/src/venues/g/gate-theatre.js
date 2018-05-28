'use strict';


const pageLoader = require('../../venue-processing/page-loader').staticLoader;

const BASE_URL = 'https://www.gatetheatre.co.uk';

exports.pageFinder = async function() {
  const result = [];

  let $ = await pageLoader(BASE_URL + '/events/all-productions');
  $('#content section:first-of-type .productions a:has(h2)').each(function() {
    const href = $(this).attr('href');
    result.push(BASE_URL + '/events/' + href);
  });

  return result;
};

exports.pageParser = async function(pageUrl) {
  const $ = await pageLoader(pageUrl);
  const title = pageUrl.substring(pageUrl.lastIndexOf('/') + 1);

  const data = [
    $('#content .columns:first-of-type .production-details').html(),
    $('#content .key-dates').html(),
    $('#content .production-info').html(),
  ];

  return { title, data };
};
