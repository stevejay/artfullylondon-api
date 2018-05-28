'use strict';


const pageLoader = require('../../venue-processing/page-loader').staticLoader;

const BASE_URL = 'http://www.residence-gallery.com';

exports.pageFinder = async function() {
  const result = [];
  const $ = await pageLoader(`${BASE_URL}/exhibitions.htm`);

  $('#div1 h3 > a').each(function() {
    const href = $(this).attr('href');

    if (href.startsWith('exhibitions/')) {
      result.push(BASE_URL + '/' + href);
    }
  });

  return result;
};

exports.pageParser = async function(pageUrl) {
  const $ = await pageLoader(pageUrl);
  const title = $('title').html();
  const data = $('#div1').html();
  return { title, data };
};

exports.venueOpenings = async function() {
  const $ = await pageLoader(BASE_URL + '/about.htm');
  return $('#div1 table').html();
};
