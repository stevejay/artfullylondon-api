'use strict';


const pageLoader = require('../../venue-processing/page-loader').staticLoader;

const BASE_URL = 'http://whitebeartheatre.co.uk';

exports.pageFinder = async function() {
  const result = [];
  const $ = await pageLoader(`${BASE_URL}/play/`);

  $('#primary article header a').each(function() {
    const href = $(this).attr('href');
    result.push(href);
  });

  return result;
};

exports.pageParser = async function(pageUrl) {
  const $ = await pageLoader(pageUrl);
  const title = $('#primary article header h1').html();

  const data = [
    $('#primary article header').html(),
    $('#primary article .entry-content').html()
  ];

  return { title, data };
};
