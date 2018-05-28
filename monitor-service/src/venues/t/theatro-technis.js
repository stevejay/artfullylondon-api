'use strict';


const pageLoader = require('../../venue-processing/page-loader').staticLoader;

const BASE_URL = 'http://www.theatrotechnis.com';

exports.pageFinder = async function() {
  const result = [];
  const $ = await pageLoader(`${BASE_URL}/index.php`);

  $('a:has(img)').each(function() {
    const href = $(this).attr('href');

    if (href.startsWith('show.php?')) {
      result.push(BASE_URL + '/' + href);
    }
  });

  return result;
};

exports.pageParser = async function(pageUrl) {
  const $ = await pageLoader(pageUrl);
  const title = $('td.title').html();
  const data = $('.main').html();
  return { title, data };
};
