'use strict';


const pageLoader = require('../../venue-processing/page-loader').staticLoader;

const BASE_URL = 'http://www.southlondongallery.org';

exports.pageFinder = async function() {
  const result = [];

  const categories = ['exhibitions', 'talks-events', 'children-families'];

  for (let i = 0; i < categories.length; ++i) {
    const $ = await pageLoader(`${BASE_URL}/page/${categories[i]}`);

    $('#records a:has(img)').each(function() {
      const href = $(this).attr('href');
      result.push(BASE_URL + href);
    });
  }

  return result;
};

exports.pageParser = async function(pageUrl) {
  const $ = await pageLoader(pageUrl);
  const title = $('title').html();
  const data = [$('#contentInner .copy').html()];
  return { title, data };
};

exports.venueOpenings = async function() {
  const $ = await pageLoader(BASE_URL + '/page/visit');
  return $('#contentInner').html();
};
