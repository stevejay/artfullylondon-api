'use strict';


const pageLoader = require('../../venue-processing/page-loader').staticLoader;

const BASE_URL = 'https://www.youngvic.org';

exports.pageFinder = async function() {
  const result = [];
  let $ = await pageLoader(`${BASE_URL}/index.php/whats-on`);

  $('.whats-on a:has(img)').each(function() {
    let href = $(this).attr('href');
    href = BASE_URL + href;
    result.push(href);
  });

  return result;
};

exports.pageParser = async function(pageUrl) {
  const $ = await pageLoader(pageUrl);
  const title = $('head meta[name="title"]').html();
  const data = [];

  $('#block-mainpagecontent').each(function() {
    data.push($(this).html());
  });

  return { title, data };
};
