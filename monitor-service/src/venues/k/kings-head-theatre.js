'use strict';


const pageLoader = require('../../venue-processing/page-loader').spaLoader;

const BASE_URL = 'http://www.kingsheadtheatre.com';

exports.pageFinder = async function() {
  const result = [];
  const $ = await pageLoader(BASE_URL);

  $('a:has(img)').each(function() {
    let href = $(this).attr('href');

    if (href.includes('kingsheadtheatre.ticketsolve.com/')) {
      result.push(href);
    }
  });

  return result;
};

exports.pageParser = async function(pageUrl) {
  return { title: pageUrl, data: pageUrl };
};
