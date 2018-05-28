'use strict';


const pageLoader = require('../../venue-processing/page-loader').staticLoader;

const BASE_URL = 'http://www.roh.org.uk';

exports.pageFinder = async function() {
  const result = [];

  let $ = await pageLoader(`${BASE_URL}/productions`);
  $('#content article ul li a:has(img)').each(function() {
    const href = $(this).attr('href');
    result.push(BASE_URL + href);
  });

  $ = await pageLoader(`${BASE_URL}/insights`);
  $('#content article ul li a:has(img)').each(function() {
    const href = $(this).attr('href');
    result.push(BASE_URL + href);
  });

  result.push('http://www.roh.org.uk/tours/backstage-tour');
  return result;
};

exports.pageParser = async function(pageUrl) {
  const $ = await pageLoader(pageUrl);
  const title = $('h1').html();
  const data = [$('.subHdrLt').html(), $('.performances').html()];
  return { title, data };
};
