'use strict';


const pageLoader = require('../../venue-processing/page-loader').staticLoader;

const BASE_URL = 'http://www.thedraytonarmstheatre.co.uk/';

exports.pageFinder = async function() {
  const $ = await pageLoader(BASE_URL);
  const result = [];

  $('.calendarcell > a').each(function() {
    const href = $(this).attr('href');

    if (href.includes('/component/jevents/eventdetail/')) {
      result.push(BASE_URL + href);
    }
  });

  return result.slice(0, 4);
};

exports.pageParser = async function(pageUrl) {
  const $ = await pageLoader(pageUrl);

  const title = $('h1')
    .map(function() {
      return $(this).text();
    })
    .get()
    .join(' ');

  const data = $('#jevents').html();
  return { title, data };
};
