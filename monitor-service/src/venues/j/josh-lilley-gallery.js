'use strict';


const pageLoader = require('../../venue-processing/page-loader').staticLoader;

const BASE_URL = 'http://www.joshlilleygallery.com';

exports.pageFinder = async function() {
  const $ = await pageLoader(BASE_URL + '/exhibitions');
  const result = [];

  $('section.slideshow li .exhibition[data-url]:has(img)').each(function() {
    let href = $(this).attr('data-url');
    result.push(BASE_URL + href);
  });

  return result.slice(0, 10);
};

exports.pageParser = async function(pageUrl) {
  const $ = await pageLoader(pageUrl);
  const title = $('.currentTitle.inDesktop').html();

  const data = [
    $('section span.datum').html(),
    $('section .pressrelease').html(),
  ];

  return { title, data };
};

exports.venueOpenings = async function() {
  const $ = await pageLoader(BASE_URL + '/contact');
  return $('.container .row .col-sm-3').html();
};
