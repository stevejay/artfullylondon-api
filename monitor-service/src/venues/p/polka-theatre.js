'use strict';


const pageLoader = require('../../venue-processing/page-loader').staticLoader;

const BASE_URL = 'https://polkatheatre.com';

exports.pageFinder = async function() {
  const result = [];

  const $ = await pageLoader(
    `${BASE_URL}/whats-on/?type=Show&date=all&age%5B%5D=all`
  );

  $('.container-body a:contains("Read More")').each(function() {
    const href = $(this).attr('href');
    result.push(href);
  });

  return result;
};

exports.pageParser = async function(pageUrl) {
  const $ = await pageLoader(pageUrl);
  const title = $('title').html();

  const data = [
    $('.content-show .heading').html(),
    $('#had-wysiwyg').html(),
    $('#ticket-prices').html(),
    $('#age-policy').html(),
    $('#dates-times').html(),
  ];

  return { title, data };
};
