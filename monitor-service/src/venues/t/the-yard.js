'use strict';


const pageLoader = require('../../venue-processing/page-loader').staticLoader;

const BASE_URL = 'http://www.theyardtheatre.co.uk';

exports.pageFinder = async function() {
  const result = [];
  const $ = await pageLoader(`${BASE_URL}/theatre.php`);

  $('a.av-upcoming-event-entry:has(img)').each(function() {
    const href = $(this).attr('href');
    result.push(href);
  });

  return result;
};

exports.pageParser = async function(pageUrl) {
  const $ = await pageLoader(pageUrl);
  const title = $('h1.main-title').html();
  const data = $('main').html();
  return { title, data };
};
