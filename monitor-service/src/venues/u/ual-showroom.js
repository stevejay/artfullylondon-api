'use strict';


const pageLoader = require('../../venue-processing/page-loader').staticLoader;

exports.pageParser = async function() {
  const data = [];

  const $ = await pageLoader('http://www.arts.ac.uk/about-ual/ual-showroom/');

  $('h2:contains(\'Current show\') + p').each(function() {
    data.push($(this).html());
  });

  return { data };
};
