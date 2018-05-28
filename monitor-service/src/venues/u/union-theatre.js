'use strict';


const pageLoader = require('../../venue-processing/page-loader').staticLoader;

const BASE_URL = 'http://www.uniontheatre.biz/';

exports.pageFinder = async function() {
  const result = [];
  const $ = await pageLoader(`${BASE_URL}whats_on.html`);

  $('#whats-on a:has(img)').each(function() {
    const href = $(this).attr('href');
    result.push(BASE_URL + '/' + href);
  });

  return result;
};

exports.pageParser = async function(pageUrl) {
  const $ = await pageLoader(pageUrl);
  const title = $('#show h1').html();
  const data = $('#show').html();
  return { title, data };
};
