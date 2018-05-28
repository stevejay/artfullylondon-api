'use strict';


const pageLoader = require('../../venue-processing/page-loader').staticLoader;

exports.pageParser = async function() {
  const $ = await pageLoader(
    'http://www.mercerchance.co.uk/exhibitions/4586074953'
  );
  const data = [];

  $('img[alt]').each(function() {
    const alt = $(this).attr('alt');
    data.push(alt);
  });

  return { data };
};
