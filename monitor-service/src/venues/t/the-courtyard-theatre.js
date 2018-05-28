'use strict';


const pageLoader = require('../../venue-processing/page-loader').staticLoader;

const BASE_URL = 'http://www.thecourtyard.org.uk';

exports.pageFinder = async function() {
  const result = [];

  const $ = await pageLoader(`${BASE_URL}/whatson/`);
  $('#content .newsitem a:has(img)').each(function() {
    const href = $(this).attr('href');
    result.push(BASE_URL + href);
  });

  return result;
};

exports.pageParser = async function(pageUrl) {
  const $ = await pageLoader(pageUrl);
  const title = $('#middle h2').html();
  const data = $('#middle').html();
  return { title, data };
};
