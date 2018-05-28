'use strict';


const pageLoader = require('../../venue-processing/page-loader').staticLoader;

const BASE_URL = 'https://www.unrestrictedview.co.uk';

exports.pageFinder = async function() {
  const result = [];

  let $ = await pageLoader(BASE_URL + '/venue/');
  $('#events-widget-4 li a').each(function() {
    const href = $(this).attr('href');
    result.push(href);
  });

  return result;
};

exports.pageParser = async function(pageUrl) {
  const $ = await pageLoader(pageUrl);
  const title = $('h3.event_title').html();

  const data = [
    $('#page-wrap .page-container .event_description').html(),
    $('#page-wrap .page-container .espresso_event_full').html(),
  ];

  return { title, data };
};
