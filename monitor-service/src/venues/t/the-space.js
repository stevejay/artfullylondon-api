'use strict';


const pageLoader = require('../../venue-processing/page-loader').staticLoader;

const BASE_URL = 'https://space.org.uk';

exports.pageFinder = async function() {
  const result = [];
  const $ = await pageLoader(`${BASE_URL}/events/`);

  $('.description a:contains(\'Find out more\')').each(function() {
    const href = $(this).attr('href');

    if (href.includes('/event/')) {
      result.push(href);
    }
  });

  return result;
};

exports.pageParser = async function(pageUrl) {
  const $ = await pageLoader(pageUrl);
  const title = $('h2.entry-title').html();

  const data = [
    $('.tribe-events-meta-group-details').html(),
    $('#content-wrap .description').html(),
  ];

  return { title, data };
};
