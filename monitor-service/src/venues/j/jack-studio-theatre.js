'use strict';


const pageLoader = require('../../venue-processing/page-loader').staticLoader;

const BASE_URL = 'http://www.brockleyjack.co.uk';

exports.pageFinder = async function() {
  const $ = await pageLoader(BASE_URL + '/whats-on/theatre/');
  const result = [];

  $('#page-main section.production a').each(function() {
    const href = $(this).attr('href');
    result.push(href);
  });

  return result;
};

exports.pageParser = async function(pageUrl) {
  const $ = await pageLoader(pageUrl);
  const title = $('h1').html();

  const data = $('.entry_content p').each(function() {
    $(this).html();
  });

  return { title, data };
};
