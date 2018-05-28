'use strict';

const pageLoader = require('../../venue-processing/page-loader').spaLoader;

exports.pageParser = async function() {
  const $ = await pageLoader(
    'https://www.bearspace.co.uk/upcoming',
    'span:contains("MORE")'
  );

  const title = $('title').text().trim();
  const data = [];

  $('#SITE_CONTAINER p').each(function() {
    data.push($(this).html());
  });

  return { data, title };
};
