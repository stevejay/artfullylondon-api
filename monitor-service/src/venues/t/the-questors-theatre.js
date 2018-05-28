'use strict';


const pageLoader = require('../../venue-processing/page-loader').staticLoader;

const BASE_URL = 'http://www.questors.org.uk';

exports.pageFinder = async function() {
  const result = [];
  const $ = await pageLoader(`${BASE_URL}/whatson.aspx`);

  $('a:has(img)').each(function() {
    const href = $(this).attr('href');

    if (href.startsWith('event.aspx')) {
      result.push(BASE_URL + '/' + href);
    }
  });

  return result;
};

exports.pageParser = async function(pageUrl) {
  const $ = await pageLoader(pageUrl);
  const title = $('h1').html();
  const data = [$('.columns:has(h1)').html()];
  return { title, data };
};
