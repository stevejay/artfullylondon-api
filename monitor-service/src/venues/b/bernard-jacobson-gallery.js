'use strict';

const pageLoader = require('../../venue-processing/page-loader').staticLoader;

const BASE_URL = 'http://www.jacobsongallery.com';

exports.pageFinder = async function() {
  const result = [];
  let $ = await pageLoader(BASE_URL + '/index.php?nav=exhibitions');

  $('#exhibitionDetails a').each(function() {
    let href = $(this).attr('href');
    result.push(BASE_URL + '/' + href);
  });

  return result;
};

exports.pageParser = async function(pageUrl) {
  const $ = await pageLoader(pageUrl);
  const title = $('title').html();

  const data = $('p').each(function() {
    $(this).html();
  });

  return { title, data };
};

exports.venueOpenings = async function() {
  const $ = await pageLoader(BASE_URL + '/index.php?nav=contactus');
  return $('#attop table').html();
};
