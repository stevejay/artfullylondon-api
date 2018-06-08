'use strict';


const pageLoader = require('../../venue-processing/page-loader').staticLoader;

const BASE_URL = 'http://www.fourcornersfilm.co.uk';

exports.pageFinder = async function() {
  const $ = await pageLoader(BASE_URL + '/gallery-%26-events');
  const result = [];

  $('#contentarea ul li a:has(img)').each(function() {
    const href = $(this).attr('href');
    result.push(BASE_URL + href);
  });

  return result;
};

exports.pageParser = async function(pageUrl) {
  const $ = await pageLoader(pageUrl);
  const title = $('h2.page_subtitle').html();

  const data = $('#contentarea .pageblocks p').each(function() {
    $(this).html();
  });

  return { title, data };
};