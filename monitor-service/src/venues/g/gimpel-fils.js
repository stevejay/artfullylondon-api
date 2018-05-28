'use strict';


const pageLoader = require('../../venue-processing/page-loader').staticLoader;

const BASE_URL = 'http://www.gimpelfils.com';

exports.pageFinder = async function() {
  const $ = await pageLoader(
    BASE_URL + '/pages/exhibitions/exhibitionindex.php'
  );
  const result = [];

  $('#content a').each(function() {
    const href = $(this).attr('href');

    if (href && href.startsWith('exhibition.php')) {
      result.push(BASE_URL + '/pages/exhibitions/' + href);
    }
  });

  return result.slice(0, 4);
};

exports.pageParser = async function(pageUrl) {
  const $ = await pageLoader(pageUrl);
  const title = $('title').html();
  const data = $('#content').html();
  return { title, data };
};

exports.venueOpenings = async function() {
  const $ = await pageLoader(BASE_URL + '/pages/contactvisit/contactvisit.php');
  return $('#content').html();
};
