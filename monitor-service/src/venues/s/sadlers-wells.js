'use strict';


const pageLoader = require('../../venue-processing/page-loader').staticLoader;

const BASE_URL = 'http://www.sadlerswells.com';

exports.pageFinder = async function() {
  const result = [];

  let $ = await pageLoader(`${BASE_URL}/whats-on/list?venues=88`);
  $('.area-production-list .whatsonchunk a:has(img)').each(function() {
    let href = $(this).attr('href');
    result.push(BASE_URL + href);
  });

  $ = await pageLoader(`${BASE_URL}/whats-on/list?venues=109`);
  $('.area-production-list .whatsonchunk a:has(img)').each(function() {
    let href = $(this).attr('href');
    result.push(BASE_URL + href);
  });

  return result;
};

exports.pageParser = async function(pageUrl) {
  let $ = await pageLoader(pageUrl);
  const title = $('#h2pagetitle').html();
  const data = [$('#showpage_contentarea').html(), $('#perf_rhs').html()];

  $ = await pageLoader(pageUrl + 'booking');
  $('#perf_lhs_content').each(function() {
    data.push($(this).html());
  });

  return { title, data };
};
