'use strict';


const pageLoader = require('../../venue-processing/page-loader').staticLoader;

const BASE_URL = 'http://www.tjboulting.com';

exports.pageFinder = async function() {
  const result = [];
  const $ = await pageLoader(`${BASE_URL}/exhibitions`);

  $('#main-contentexhib a:not(:contains(\'past\'))').each(function() {
    const href = $(this).attr('href');

    if (href.includes('/exhibitionspage/')) {
      result.push(BASE_URL + href);
    }
  });

  return result;
};

exports.pageParser = async function(pageUrl) {
  const $ = await pageLoader(pageUrl);
  const title = pageUrl;
  const data = $('#excontent').html();
  return { title, data };
};

exports.venueOpenings = async function() {
  const $ = await pageLoader(BASE_URL + '/contact');
  return $('#main-contentcontact').html();
};
