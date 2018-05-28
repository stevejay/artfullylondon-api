'use strict';


const pageLoader = require('../../venue-processing/page-loader').staticLoader;

const BASE_URL = 'https://www.coningsbygallery.com';

exports.pageFinder = async function() {
  const result = [];

  const $ = await pageLoader(`${BASE_URL}/exhibitions`);
  $('section.exhibitions ul li a:has(img)').each(function() {
    const href = $(this).attr('href');
    result.push(BASE_URL + href);
  });

  return result;
};

exports.pageParser = async function(pageUrl) {
  const $ = await pageLoader(pageUrl);
  const title = $('#content article h2').html();
  const data = [$('#content article').html(), $('#content .opening').html()];
  return { title, data };
};

exports.venueOpenings = async function() {
  const $ = await pageLoader(BASE_URL + '/contact');
  return $('.span-5:has(h2:contains("Gallery information"))').html();
};
