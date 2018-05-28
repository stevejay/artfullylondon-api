'use strict';


const pageLoader = require('../../venue-processing/page-loader').staticLoader;

const BASE_URL = 'https://rowing.gallery';

exports.pageFinder = async function() {
  const result = [];
  const $ = await pageLoader(`${BASE_URL}/exhibitions/`);

  $('#container section .current-list article a').each(function() {
    const href = $(this).attr('href');
    result.push(href);
  });

  return result;
};

exports.pageParser = async function(pageUrl) {
  const $ = await pageLoader(pageUrl);
  const title = $('article header h1').html();
  const data = [$('#js-text-content').html()];
  return { title, data };
};

exports.venueOpenings = async function() {
  const $ = await pageLoader(BASE_URL + '/contact/');
  return $('#container .content').html();
};
