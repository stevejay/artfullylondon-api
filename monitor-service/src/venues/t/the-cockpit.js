'use strict';


const pageLoader = require('../../venue-processing/page-loader').staticLoader;

const BASE_URL = 'http://www.thecockpit.org.uk';

exports.pageFinder = async function() {
  const result = [];

  let $ = await pageLoader(`${BASE_URL}/`);
  $('#block-system-main .view-content a:has(img)').each(function() {
    const href = $(this).attr('href');
    result.push(BASE_URL + href);
  });

  $ = await pageLoader(`${BASE_URL}/taxonomy/term/20`);
  $(
    '#block-views-ud-upcoming-shows-block-5 .view-content a:has(img)'
  ).each(function() {
    const href = $(this).attr('href');
    result.push(BASE_URL + href);
  });

  return result;
};

exports.pageParser = async function(pageUrl) {
  const $ = await pageLoader(pageUrl);
  const title = $('#page-title').html();
  const data = $('#main').html();
  return { title, data };
};
