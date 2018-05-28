'use strict';

const pageLoader = require('../../venue-processing/page-loader').staticLoader;

exports.pageFinder = async function() {
  const result = [];

  let $ = await pageLoader(
    'http://www.annelyjudafineart.co.uk/exhibitions/current'
  );
  $('#current-exhibitions a').each(function() {
    const href = $(this).attr('href');
    result.push(href);
  });

  $ = await pageLoader(
    'http://www.annelyjudafineart.co.uk/exhibitions/forthcoming'
  );
  $('ul.forthcoming-exhibitions a').each(function() {
    const href = $(this).attr('href');
    result.push('http://www.annelyjudafineart.co.uk' + href);
  });

  return result;
};

exports.pageParser = async function(pageUrl) {
  const $ = await pageLoader(pageUrl);
  const title = $('h1').html();
  const data = $('#main-content .text-panel').html();
  return { title, data };
};

exports.venueOpenings = async function() {
  const $ = await pageLoader('http://www.annelyjudafineart.co.uk/about');
  return $('.opening-hours').html();
};
