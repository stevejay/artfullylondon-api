'use strict';


const pageLoader = require('../../venue-processing/page-loader').staticLoader;

const BASE_URL = 'http://www.nationalgallery.org.uk';

exports.pageFinder = async function() {
  const result = [];
  const $ = await pageLoader(`${BASE_URL}/whats-on/exhibitions`);

  $('main .event-content-panel .title a').each(function() {
    const href = $(this).attr('href');
    result.push(BASE_URL + href);
  });

  return result;
};

exports.pageParser = async function(pageUrl) {
  const $ = await pageLoader(pageUrl);
  const title = $('.event-info h1').html();

  const data = [
    $('.event-info-date-price').html(),
    $('.event-body-main > div').html(),
  ];

  return { title, data };
};
