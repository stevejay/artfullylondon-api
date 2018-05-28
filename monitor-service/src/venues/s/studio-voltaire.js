'use strict';


const pageLoader = require('../../venue-processing/page-loader').staticLoader;

exports.pageParser = async function() {
  const data = [];

  let $ = await pageLoader('http://www.studiovoltaire.org/exhibitions/');
  data.push($('.fullWidthContainer:has(h1)').html());

  $ = await pageLoader(
    'http://www.studiovoltaire.org/exhibitions/forthcoming/'
  );

  data.push($('.fullWidthContainer:has(h1)').html());

  return { data };
};

exports.venueOpenings = async function() {
  const $ = await pageLoader('http://www.studiovoltaire.org/visit/');
  return $('#gmap + div').html();
};
