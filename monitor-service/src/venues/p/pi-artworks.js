'use strict';


const pageLoader = require('../../venue-processing/page-loader').staticLoader;

const BASE_URL = 'http://www.piartworks.com';

exports.pageFinder = async function() {
  const result = [];
  const $ = await pageLoader(`${BASE_URL}/`);

  $('table > tbody > tr > td > a:has(img)').each(function() {
    const href = $(this).attr('href');
    result.push(BASE_URL + '/' + href);
  });

  return result;
};

exports.pageParser = async function(pageUrl) {
  const $ = await pageLoader(pageUrl);
  const title = $('title').html();
  const data = $('body > table > tbody > tr:nth-of-type(2)').html();
  return { title, data };
};
