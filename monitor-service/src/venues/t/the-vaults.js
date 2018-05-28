'use strict';


const pageLoader = require('../../venue-processing/page-loader').spaLoader;

const BASE_URL = 'https://www.thevaults.london';

exports.pageUrlChunks = 1;

exports.pageFinder = async function() {
  const result = [];

  const $ = await pageLoader(
    `${BASE_URL}/whats-on`,
    '#PAGES_CONTAINERcenteredContent'
  );

  $('#PAGES_CONTAINERcenteredContent a').each(function() {
    const href = $(this).attr('href');

    if (href && href.startsWith(BASE_URL)) {
      result.push(href);
    }
  });

  return result;
};

exports.pageParser = async function(pageUrl) {
  const $ = await pageLoader(pageUrl);
  const title = $('#PAGES_CONTAINERcenteredContent h2').html();
  const data = $('#PAGES_CONTAINERcenteredContent').html();
  return { title, data };
};
