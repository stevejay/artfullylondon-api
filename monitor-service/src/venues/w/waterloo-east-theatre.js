'use strict';


const pageLoader = require('../../venue-processing/page-loader').staticLoader;

const BASE_URL = 'http://www.waterlooeast.co.uk';

exports.pageFinder = async function() {
  const result = [];
  const $ = await pageLoader(`${BASE_URL}/`);

  $('a:has(img)').each(function() {
    const alt = $(this).find('img').attr('alt');

    if (alt && alt.includes('More info.')) {
      let href = $(this).attr('href');
      result.push(BASE_URL + '/' + href);
    }
  });

  return result;
};

exports.pageParser = async function(pageUrl) {
  const $ = await pageLoader(pageUrl);
  const title = $('title').html();
  const data = [];

  $('p.Normal-P0').each(function() {
    data.push($(this).html());
  });

  return { title, data };
};
