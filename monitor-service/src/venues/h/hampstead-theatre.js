'use strict';


const pageLoader = require('../../venue-processing/page-loader').staticLoader;

const BASE_URL = 'https://www.hampsteadtheatre.com';

exports.pageFinder = async function() {
  const result = [];

  let $ = await pageLoader(BASE_URL + '/whats-on/main-stage/');
  $('.prodlist__buttons > a').each(function() {
    const href = $(this).attr('href');
    result.push(BASE_URL + href);
  });

  $ = await pageLoader(BASE_URL + '/whats-on/hampstead-downstairs/');
  $('.prodlist__buttons > a').each(function() {
    const href = $(this).attr('href');
    result.push(BASE_URL + href);
  });

  return result;
};

exports.pageParser = async function(pageUrl) {
  const $ = await pageLoader(pageUrl);
  const title = $('h1.production-intro__title').html();

  const data = [
    $('.production-intro').html(),
    $('#details').html(),
    $('.timetables').html(),
  ];

  return { title, data };
};
