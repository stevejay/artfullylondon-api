'use strict';


const pageLoader = require('../../venue-processing/page-loader').staticLoader;

const BASE_URL = 'http://www.sesameart.com';

exports.pageFinder = async function() {
  const $ = await pageLoader(BASE_URL + '/exhibitions');
  const result = [];

  $('#block-views-exhibitions-block-2 .ExhibitionListTitle a').each(function() {
    const href = $(this).attr('href');
    result.push(BASE_URL + href);
  });

  return result.slice(0, 5);
};

exports.pageParser = async function(pageUrl) {
  const $ = await pageLoader(pageUrl);
  const title = $('#page-title').html();
  const data = $('#block-views-exhibitions-block-3 .view-content').html();
  return { title, data };
};

exports.venueOpenings = async function() {
  const $ = await pageLoader(BASE_URL + '/contact');
  return $('.sidebar .content').html();
};
