'use strict';


const pageLoader = require('../../venue-processing/page-loader').staticLoader;

const BASE_URL = 'http://www.roseplayhouse.org.uk';

exports.pageFinder = async function() {
  const result = [];
  const $ = await pageLoader(`${BASE_URL}/experience/events/`);

  $('.event_title h3 > a').each(function() {
    const href = $(this).attr('href');

    if (href.includes('/events/')) {
      result.push(href);
    }
  });

  return result;
};

exports.pageParser = async function(pageUrl) {
  const $ = await pageLoader(pageUrl);
  const title = $('#page_title').html();
  const data = [$('#event_info').html(), $('#event_detail').html()];
  return { title, data };
};
