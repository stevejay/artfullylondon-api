'use strict';

const pageLoader = require('../../venue-processing/page-loader').staticLoader;

exports.pageFinder = async function() {
  let $ = await pageLoader('http://www.atlasgallery.com/current-exhibitions');

  const currentExhibitionLinks = $('body')
    .find('section.content div:has(h2:contains("Current Exhibitions"))')
    .find('a');

  $ = await pageLoader('http://www.atlasgallery.com/future-exhibitions');

  const futureExhibitionLinks = $('body')
    .find('section.content div:has(h2:contains("Future Exhibitions"))')
    .find('a');

  const result = [];

  currentExhibitionLinks.each(function() {
    const href = $(this).attr('href');
    result.push(href);
  });

  futureExhibitionLinks.each(function() {
    const href = $(this).attr('href');
    result.push(href);
  });

  return result;
};

exports.pageParser = async function(pageUrl) {
  const $ = await pageLoader(pageUrl);
  const title = $('.content h1').html();
  const data = $('main.content > div:first-of-type').html();
  return { title, data };
};

exports.venueOpenings = async function() {
  const $ = await pageLoader('http://www.atlasgallery.com/contact');
  return $('section.content article').html();
};
