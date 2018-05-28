'use strict';


const pageLoader = require('../../venue-processing/page-loader').staticLoader;

const BASE_URL = 'http://www.finboroughtheatre.co.uk';

exports.pageFinder = async function() {
  const $ = await pageLoader(BASE_URL + '/productions.php');
  const result = [];

  $('.production_blurb img + a').each(function() {
    const href = $(this).attr('href');

    if (href.startsWith(BASE_URL)) {
      result.push(href);
    }
  });

  $('.production_blurb a:has(img)').each(function() {
    const href = $(this).attr('href');

    if (href.startsWith(BASE_URL)) {
      result.push(href);
    }
  });

  return result;
};

exports.pageParser = async function(pageUrl) {
  const $ = await pageLoader(pageUrl);
  const title = $('h1').html();

  const data = [
    $('#production_title_date').html(),
    $('#main-text').html(),
    $('#production_text_tickets').html(),
  ];

  return { title, data };
};
