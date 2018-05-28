'use strict';


const pageLoader = require('../../venue-processing/page-loader').staticLoader;

const BASE_URL = 'https://www.hoxtonhall.co.uk';

exports.pageFinder = async function() {
  const result = [];
  const eventSelector = '.content_section .post_block a:has(img)';

  let $ = await pageLoader(BASE_URL + '/category/whatson/dance/');
  $(eventSelector).each(function() {
    const href = $(this).attr('href');
    result.push(href);
  });

  $ = await pageLoader(BASE_URL + '/category/whatson/theatre/');
  $(eventSelector).each(function() {
    const href = $(this).attr('href');
    result.push(href);
  });

  $ = await pageLoader(BASE_URL + '/category/whatson/events/');
  $(eventSelector).each(function() {
    const href = $(this).attr('href');
    result.push(href);
  });

  return result;
};

exports.pageParser = async function(pageUrl) {
  const $ = await pageLoader(pageUrl);
  const title = $('.left_content h1.post_title').html();

  const data = $('#content .left_content p').each(function() {
    $(this).html();
  });

  return { title, data };
};
