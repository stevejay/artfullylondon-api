'use strict';

const pageLoader = require('../../venue-processing/page-loader').staticLoader;

const BASE_URL = 'http://chisenhale.org.uk';

exports.pageFinder = async function() {
  const $ = await pageLoader(
    BASE_URL + '/exhibitions/forthcoming_exhibitions.php'
  );
  const result = [];

  $('article a:has(h2)').each(function() {
    const href = $(this).attr('href');
    result.push(BASE_URL + '/exhibitions/' + href);
  });

  return result;
};

exports.pageParser = async function(pageUrl) {
  const $ = await pageLoader(pageUrl);
  const title = $('h2').html();
  const data = $('article').html();
  return { title, data };
};

exports.venueOpenings = async function() {
  const $ = await pageLoader(BASE_URL + '/visit/');
  return $('article').html();
};
