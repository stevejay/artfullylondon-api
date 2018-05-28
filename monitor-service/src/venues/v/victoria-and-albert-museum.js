'use strict';


const pageLoader = require('../../venue-processing/page-loader').staticLoader;

const BASE_URL = 'https://www.vam.ac.uk';

exports.pageFinder = async function() {
  const result = [];
  const categories = ['exhibition', 'family', 'special-event'];

  for (let i = 0; i < categories.length; ++i) {
    const $ = await pageLoader(`${BASE_URL}/whatson?type=${categories[i]}/`);

    $('.wo-events li a:has(img)').each(function() {
      const href = $(this).attr('href');
      result.push(BASE_URL + href);
    });
  }

  return result;
};

exports.pageParser = async function(pageUrl) {
  const $ = await pageLoader(pageUrl);
  const title = $('title').html();
  const data = $('main').html();
  return { title, data };
};

exports.venueOpenings = async function() {
  const $ = await pageLoader(BASE_URL + '/visit');
  return $('#hours').html();
};
