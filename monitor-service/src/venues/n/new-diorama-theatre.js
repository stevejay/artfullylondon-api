'use strict';


const pageLoader = require('../../venue-processing/page-loader').staticLoader;

const BASE_URL = 'http://www.newdiorama.com';

exports.pageFinder = async function() {
  const result = [];
  const $ = await pageLoader(`${BASE_URL}/whats-on`);

  $('#items a:has(img)').each(function() {
    const href = $(this).attr('href');
    result.push(href);
  });

  return result;
};

exports.pageParser = async function(pageUrl) {
  const $ = await pageLoader(pageUrl);
  const title = $('title').html();
  const data = [];

  $('#project .content-wrap').each(function() {
    data.push($(this).html());
  });

  $('#project .sidebar-content').each(function() {
    data.push($(this).html());
  });

  return { title, data };
};
