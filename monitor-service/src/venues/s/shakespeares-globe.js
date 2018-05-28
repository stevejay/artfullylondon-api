'use strict';


const pageLoader = require('../../venue-processing/page-loader').staticLoader;

const BASE_URL = 'http://www.shakespearesglobe.com';

exports.pageFinder = async function() {
  const result = [];
  const $ = await pageLoader(`${BASE_URL}/theatre/whats-on`);

  $('#mainArticle a:has(img)').each(function() {
    const href = $(this).attr('href');

    if (!href.includes('#')) {
      result.push(href);
    }
  });

  return result;
};

exports.pageParser = async function(pageUrl) {
  const $ = await pageLoader(pageUrl);
  const title = $('title').html();
  const data = [$('article.showdates').html(), $('#mainArticle').html()];
  return { title, data };
};
