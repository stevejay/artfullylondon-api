'use strict';

const pageLoader = require('../../venue-processing/page-loader').staticLoader;

exports.pageFinder = async function() {
  const result = [];
  const $ = await pageLoader('https://artstheatrewestend.co.uk/whats-on/');

  $('#main .whats-on-item a:first-of-type').each(function() {
    const href = $(this).attr('href').replace('\'', '');
    result.push(href);
  });

  return result;
};

exports.pageParser = async function(pageUrl) {
  const $ = await pageLoader(pageUrl);
  const title = $('h1').html();
  const data = $('.whats-on-event').html();
  return { title, data };
};
