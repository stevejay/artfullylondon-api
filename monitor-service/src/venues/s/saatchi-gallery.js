'use strict';


const pageLoader = require('../../venue-processing/page-loader').staticLoader;

const BASE_URL = 'http://www.saatchigallery.com';

exports.pageFinder = async function() {
  const result = [];
  const $ = await pageLoader(`${BASE_URL}/whatson.php`);

  $('.exhibition a:has(h3)').each(function() {
    let href = $(this).attr('href');

    if (!href.startsWith('http')) {
      href = BASE_URL + href;
    }

    result.push(href);
  });

  return result;
};

exports.pageParser = async function(pageUrl) {
  const $ = await pageLoader(pageUrl);
  const title = $('title').html();
  const data = [];

  $('#content_blocks h3').each(function() {
    data.push($(this).html());
  });

  data.push($('#leftside_records').html());

  return { title, data };
};

exports.venueOpenings = async function() {
  const $ = await pageLoader(BASE_URL);
  return $('#rightcol .borderedbox').html();
};
