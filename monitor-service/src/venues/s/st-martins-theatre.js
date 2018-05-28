'use strict';


const pageLoader = require('../../venue-processing/page-loader').spaLoader;

exports.pageParser = async function() {
  let $ = await pageLoader(
    'https://www.the-mousetrap.co.uk/online/default.asp'
  );

  const data = $('#main_table').html();
  return { data };
};
