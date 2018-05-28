'use strict';


const pageLoader = require('../../venue-processing/page-loader').staticLoader;

const BASE_URL = 'http://www.dulwichpicturegallery.org.uk';

exports.pageFinder = async function() {
  const $ = await pageLoader(
    BASE_URL + '/whats-on/?category=43986&date=&PageId=1055'
  );
  const result = [];

  $('.content-container.whatson a:has(img)').each(function() {
    const href = $(this).attr('href');
    result.push(BASE_URL + href);
  });

  return result;
};

exports.pageParser = async function(pageUrl) {
  const $ = await pageLoader(pageUrl);
  const title = $('h1').html();

  const data = [
    $('main + .callout .callout-content').html(),
    $('.content-container main').html(),
  ];

  return { title, data };
};

exports.venueOpenings = async function() {
  const $ = await pageLoader(BASE_URL + '/visit/opening-times/');
  return $('.content main').html();
};
