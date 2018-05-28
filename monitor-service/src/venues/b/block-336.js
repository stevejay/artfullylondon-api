'use strict';

const pageLoader = require('../../venue-processing/page-loader').staticLoader;

const BASE_URL = 'http://block336.com';

exports.pageFinder = async function() {
  const result = [];
  const $ = await pageLoader(BASE_URL + '/exhibitions/');

  $('#wrapper div[gg-link]').each(function() {
    let href = $(this).attr('gg-link');
    result.push(href);
  });

  return result.slice(0, 4);
};

exports.pageParser = async function(pageUrl) {
  const $ = await pageLoader(pageUrl);
  const title = $('title').html();

  const data = $('.justifytext p').each(function() {
    $(this).html();
  });

  return { title, data };
};
