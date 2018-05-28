'use strict';


const pageLoader = require('../../venue-processing/page-loader').staticLoader;

const BASE_URL = 'https://www.donmarwarehouse.com';

exports.pageFinder = async function() {
  const $ = await pageLoader(BASE_URL + '/whats-on/');
  const result = [];

  $('.production-card a').each(function() {
    let href = $(this).attr('href');

    if (!href.startsWith('http')) {
      href = BASE_URL + href;
    }

    result.push(href);
  });

  return result;
};

exports.pageParser = async function(pageUrl) {
  const $ = await pageLoader(pageUrl);
  const title = $('h1').html();
  const data = $('.article-content .article-body').html();
  return { title, data };
};
