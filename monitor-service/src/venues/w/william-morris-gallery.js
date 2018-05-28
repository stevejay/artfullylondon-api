'use strict';


const pageLoader = require('../../venue-processing/page-loader').staticLoader;

const BASE_URL = 'http://www.wmgallery.org.uk';

exports.pageFinder = async function() {
  const result = [];
  let $ = await pageLoader(`${BASE_URL}/whats-on/exhibitions-43`);

  $('#body a:has(img)').each(function() {
    const href = $(this).attr('href');
    result.push(href);
  });

  $ = await pageLoader(`${BASE_URL}/whats-on/events-calendar`);

  $('#body a:has(img)').each(function() {
    const href = $(this).attr('href');
    result.push(href);
  });

  return result;
};

exports.pageParser = async function(pageUrl) {
  const $ = await pageLoader(pageUrl);
  const title = $('hgroup').html();
  const data = [$('#body section.info').html(), $('#body article').html()];
  return { title, data };
};

exports.venueOpenings = async function() {
  const $ = await pageLoader(BASE_URL + '/visit');
  return $('#banner_grid').html();
};
