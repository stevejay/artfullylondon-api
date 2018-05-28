'use strict';


const pageLoader = require('../../venue-processing/page-loader').staticLoader;

const BASE_URL = 'http://shoreditchtownhall.com';

exports.pageFinder = async function() {
  const result = [];
  let $ = await pageLoader(`${BASE_URL}/theatre-performance/whats-on`);

  while (true) {
    $('article.listing-item a:has(img)').each(function() {
      const href = $(this).attr('href');
      result.push(href);
    });

    const nextUrl = $('.pagination a:contains(\'Next\')').first().attr('href');

    if (nextUrl) {
      $ = await pageLoader(nextUrl);
    } else {
      break;
    }
  }

  return result;
};

exports.pageParser = async function(pageUrl) {
  const $ = await pageLoader(pageUrl);
  const title = $('#pagecontent h1').html();
  const data = $('#pagecontent').html();
  return { title, data };
};
