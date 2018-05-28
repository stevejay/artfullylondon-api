'use strict';


const pageLoader = require('../../venue-processing/page-loader').staticLoader;

const BASE_URL = 'http://theunitldn.com';

exports.pageFinder = async function() {
  const result = [];
  const $ = await pageLoader(`${BASE_URL}/portfolio/`);

  $('#slideshow a').each(function() {
    const href = $(this).attr('href');

    if (href.startsWith(BASE_URL)) {
      result.push(href);
    }
  });

  return result;
};

exports.pageParser = async function(pageUrl) {
  const $ = await pageLoader(pageUrl);
  const title = $('.blog-header h1').html();
  const data = [$('.blog-header').html(), $('#content #content_module').html()];
  return { title, data };
};

exports.venueOpenings = async function() {
  const $ = await pageLoader(BASE_URL + '/contact/');
  return $('#content_module').html();
};
