'use strict';


const pageLoader = require('../../venue-processing/page-loader').staticLoader;

const BASE_URL = 'http://www.yeolderoseandcrowntheatrepub.co.uk';

exports.pageFinder = async function() {
  const result = [];
  let $ = await pageLoader(`${BASE_URL}/index.php/in-the-theatre/`);

  $('.main a:contains("More Info")').each(function() {
    const href = $(this).attr('href');
    result.push(href);
  });

  return result;
};

exports.pageParser = async function(pageUrl) {
  const $ = await pageLoader(pageUrl);
  const title = $('.cro_title').html();
  const data = [$('.singlepage').html()];
  return { title, data };
};
