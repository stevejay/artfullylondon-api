'use strict';


const pageLoader = require('../../venue-processing/page-loader').staticLoader;

const BASE_URL = 'http://www.whitechapelgallery.org';

exports.pageFinder = async function() {
  const result = [];
  const $ = await pageLoader(`${BASE_URL}/exhibitions/`);
  const sections = ['On Now', 'Coming Soon'];

  for (let i = 0; i < sections.length; ++i) {
    $(
      `.pageContainer > .contentWrapper:has(h1:contains('${sections[i]}')) a:has(img)`
    ).each(function() {
      const href = $(this).attr('href');
      result.push(href);
    });
  }

  return result;
};

exports.pageParser = async function(pageUrl) {
  const $ = await pageLoader(pageUrl);
  const title = $('.contentWrapper h1').html();

  const data = [
    $('.contentWrapper .visitStatus').html(),
    $('.contentWrapper .visitInfo').html()
  ];

  return { title, data };
};

exports.venueOpenings = async function() {
  const $ = await pageLoader(BASE_URL + '/visit/');
  return $('.visit .row > .oneQuartMedia').html();
};
