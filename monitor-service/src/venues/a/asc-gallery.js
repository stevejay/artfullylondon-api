'use strict';

const pageLoader = require('../../venue-processing/page-loader').staticLoader;

exports.pageFinder = async function() {
  const $ = await pageLoader('http://www.ascstudios.co.uk/asc-gallery/');
  const links = $('body').find('ul.gallery div.event a');
  const result = [];

  links.each(function() {
    const href = $(this).attr('href');
    result.push(href);
  });

  return result;
};

exports.pageParser = async function(pageUrl) {
  const $ = await pageLoader(pageUrl);
  const title = $('title').html();

  const data = [
    $('div.tribe-events-schedule').html(),
    $('div.tribe-events-content.description').html(),
  ];

  return { title, data };
};

exports.venueOpenings = async function() {
  const $ = await pageLoader('http://www.ascstudios.co.uk/asc-gallery/');
  return $('#content .entry-content .frame').html();
};
