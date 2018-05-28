'use strict';


const pageLoader = require('../../venue-processing/page-loader').staticLoader;

const BASE_URL = 'https://www.jacksonslane.org.uk';

exports.pageFinder = async function() {
  const $ = await pageLoader(BASE_URL + '/whats-on');
  const result = [];

  $('.event a:has(h2)').each(function() {
    const href = $(this).attr('href');
    result.push(BASE_URL + href);
  });

  return result;
};

exports.pageParser = async function(pageUrl) {
  const $ = await pageLoader(pageUrl);
  const title = $('.title > h2').html();

  const data = [
    $('main.main--event-detail .title').html(),
    $('main.main--event-detail .m-article').html(),
  ];

  return { title, data };
};
