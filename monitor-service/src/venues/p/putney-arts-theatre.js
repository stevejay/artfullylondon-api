'use strict';


const pageLoader = require('../../venue-processing/page-loader').staticLoader;

const BASE_URL = 'http://www.putneyartstheatre.org.uk';

exports.pageFinder = async function() {
  const result = [];
  const $ = await pageLoader(`${BASE_URL}/whats-on/`);

  $('.listContent a:has(img)').each(function() {
    let href = $(this).attr('href');
    href = href.startsWith('http') ? href : BASE_URL + '/' + href;
    result.push(href);
  });

  return result;
};

exports.pageParser = async function(pageUrl) {
  const $ = await pageLoader(pageUrl);
  const title = $('title').html();
  const data = [$('.content .container > div:nth-of-type(2)').html()];
  return { title, data };
};
