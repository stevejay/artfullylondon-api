'use strict';


const pageLoader = require('../../venue-processing/page-loader').staticLoader;
// const pageLoader = require('../../venue-processing/page-loader').spaLoader;

const BASE_URL = 'https://theatre503.com';

exports.pageUrlChunks = 1;

exports.pageFinder = async function() {
  const result = [];
  const $ = await pageLoader(`${BASE_URL}/`);

  $('#nav ul.children a').each(function() {
    const href = $(this).attr('href');

    if (href.includes('/whats-on/')) {
      result.push(href);
    }
  });

  return result;
};

exports.pageParser = async function(pageUrl) {
  return { title: pageUrl, data: pageUrl };

  // Error: Failed to GET url: https://theatre503.com/whats-on/punts/

  // const $ = await pageLoader(pageUrl, '.DetailsContainer h1');
  // const title = $('.DetailsContainer h1').html();
  // const data = [$('.DetailsContainer').html()];
  // return { title, data };
};
