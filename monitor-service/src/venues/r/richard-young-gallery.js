'use strict';


const pageLoader = require('../../venue-processing/page-loader').spaLoader;

const BASE_URL = 'http://www.richardyounggallery.co.uk';

exports.pageFinder = async function() {
  const result = [];

  const $ = await pageLoader(
    `${BASE_URL}/exhibitions`,
    '.current-exhibition-wrapper'
  );

  $('.current-exhibition-wrapper a:has(img)').each(function() {
    const href = $(this).attr('href');
    result.push(BASE_URL + href);
  });

  return result;
};

exports.pageParser = async function(pageUrl) {
  const $ = await pageLoader(pageUrl, '.section-exhibition');
  const title = $('.section-exhibition .exhibition-title-wrapper').html();
  const data = [$('.section-exhibition .content-container').html()];
  return { title, data };
};

exports.venueOpenings = async function() {
  const $ = await pageLoader(BASE_URL + '/contact');
  return $('.gallery-hours-wrapper').html();
};
