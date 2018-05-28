'use strict';


const pageLoader = require('../../venue-processing/page-loader').spaLoader;

exports.pageParser = async function() {
  const $ = await pageLoader(
    'http://www.clfartcafe.org/theatre',
    '#PAGES_CONTAINERinlineContent'
  );

  const data = $('#PAGES_CONTAINERinlineContent').html();
  return { data };
};
