'use strict';


const pageLoader = require('../../venue-processing/page-loader').staticLoader;

const BASE_URL = 'https://www.hauserwirth.com';

exports.pageFinder = async function() {
  const result = [];
  const linkSelector = '#container ul li dl:has(dd:contains(\'London\')) dt a';

  let $ = await pageLoader(BASE_URL + '/exhibitions/');
  $(linkSelector).each(function() {
    const href = $(this).attr('href');

    if (href.startsWith('/exhibitions/')) {
      result.push(BASE_URL + href);
    }
  });

  $ = await pageLoader(BASE_URL + '/exhibitions/forthcoming/');
  $(linkSelector).each(function() {
    const href = $(this).attr('href');

    if (href.startsWith('/exhibitions/')) {
      result.push(BASE_URL + href);
    }
  });

  return result;
};

exports.pageParser = async function(pageUrl) {
  const $ = await pageLoader(pageUrl);
  const title = $('h1').html();
  const data = $('#mainColumn .content').html();
  return { title, data };
};
