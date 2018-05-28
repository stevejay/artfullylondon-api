'use strict';


const pageLoader = require('../../venue-processing/page-loader').spaLoader;

exports.pageParser = async function() {
  const data = [];

  const $ = await pageLoader('https://www.woolffgallery.co.uk/');
  $('h2').each(function() {
    data.push($(this).html());
  });

  return { data };
};
