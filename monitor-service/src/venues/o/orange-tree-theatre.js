'use strict';


const pageLoader = require('../../venue-processing/page-loader').staticLoader;

const BASE_URL = 'https://www.orangetreetheatre.co.uk';

exports.pageFinder = async function() {
  const result = [];
  const $ = await pageLoader(`${BASE_URL}/whats-on`);

  $('#project-list a').each(function() {
    const href = $(this).attr('href');
    result.push(href);
  });

  return result;
};

exports.pageParser = async function(pageUrl) {
  const $ = await pageLoader(pageUrl);
  const title = $('#project-item .show-item-title').html();
  const data = [$('#project-item .show-item-header').html()];

  $('#project-item .content-area p').each(function() {
    data.push($(this).html());
  });

  return { title, data };
};
