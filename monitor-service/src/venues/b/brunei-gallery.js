'use strict';

const pageLoader = require('../../venue-processing/page-loader').staticLoader;

const BASE_URL = 'https://www.soas.ac.uk';

exports.pageFinder = async function() {
  const result = [];
  const $ = await pageLoader(BASE_URL + '/gallery/forthcoming/');

  $('#content li a').each(function() {
    const href = $(this).attr('href');
    result.push(BASE_URL + href);
  });

  return result;
};

exports.pageParser = async function(pageUrl) {
  const $ = await pageLoader(pageUrl);
  const title = $('h1').html();
  const data = $('article.eventdetail').html();
  return { title, data };
};
