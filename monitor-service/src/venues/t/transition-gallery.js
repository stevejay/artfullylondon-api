'use strict';


const pageLoader = require('../../venue-processing/page-loader').staticLoader;

const BASE_URL = 'http://www.transitiongallery.co.uk/htmlpages';

exports.pageFinder = async function() {
  let result = [];

  let $ = await pageLoader(`${BASE_URL}/shows.htm`);
  $('strong > em > a').each(function() {
    const href = $(this).attr('href');
    result.push(BASE_URL + '/' + href);
  });

  result = result.slice(0, 4);

  $ = await pageLoader(`${BASE_URL}/future.htm`);
  $('strong > em > a').each(function() {
    const href = $(this).attr('href');
    result.push(BASE_URL + '/' + href);
  });

  return result;
};

exports.pageParser = async function(pageUrl) {
  const $ = await pageLoader(pageUrl);
  const title = $('title').html();
  const data = $('body > table').html();
  return { title, data };
};
