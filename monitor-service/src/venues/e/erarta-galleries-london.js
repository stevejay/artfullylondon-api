'use strict';


const pageLoader = require('../../venue-processing/page-loader').staticLoader;

const BASE_URL = 'http://www.erartagalleries.com';

exports.pageFinder = async function() {
  const $ = await pageLoader(
    BASE_URL +
      '/component/zoo/advanced-search/1063.html?Itemid=117&page=1&order=3a9ca1ae-bedc-481b-bccf-1e48b2e01cbd&direction=desc&ordertype=date&application=1'
  );

  const result = [];

  $(
    'section div.news-layout:has(li:contains("ERARTA London")) li.first a'
  ).each(function() {
    const href = $(this).attr('href');
    result.push(BASE_URL + href);
  });

  return result;
};

exports.pageParser = async function(pageUrl) {
  const $ = await pageLoader(pageUrl);
  const title = $('h1').html();
  const data = $('#yoo-zoo').html();
  return { title, data };
};

exports.venueOpenings = async function() {
  const $ = await pageLoader(BASE_URL + '/london.html');
  return $('#yoo-zoo').html();
};
