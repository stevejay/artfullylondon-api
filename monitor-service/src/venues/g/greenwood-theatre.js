'use strict';


const pageLoader = require('../../venue-processing/page-loader').staticLoader;

const BASE_URL = 'http://www.kcl.ac.uk';

exports.pageFinder = async function() {
  const $ = await pageLoader(BASE_URL + '/greenwood/whatson/index.aspx');
  const result = [];

  $('#Listing1_List a:has(img)').each(function() {
    const href = $(this).attr('href');
    result.push(BASE_URL + href);
  });

  return result;
};

exports.pageParser = async function(pageUrl) {
  const $ = await pageLoader(pageUrl);
  const title = $('title').html();
  const data = $('#events_item_column').html();
  return { title, data };
};
