'use strict';


const pageLoader = require('../../venue-processing/page-loader').staticLoader;

const BASE_URL = 'http://www.jermynstreettheatre.co.uk';

exports.pageFinder = async function() {
  const $ = await pageLoader(BASE_URL + '/whats-on/');
  const result = [];

  $('.ttr_article a:contains("Information")').each(function() {
    const href = $(this).attr('href');
    result.push(href);
  });

  return result;
};

exports.pageParser = async function(pageUrl) {
  const $ = await pageLoader(pageUrl);
  const title = $('.ttr_post_title').html();
  const data = $('.ttr_article').html();
  return { title, data };
};
