'use strict';

const co = require('co');
const pageLoader = require('../../venue-processing/page-loader').staticLoader;

const BASE_URL = 'https://wiltons.org.uk';

exports.pageFinder = co.wrap(function*() {
  const result = [];

  const d = new Date();
  let year = d.getFullYear();
  let month = d.getMonth() + 1;

  for (let monthCount = 0; monthCount < 12; ++monthCount) {
    const url = `${BASE_URL}/whatson/${year}${month < 10 ? '0' : ''}${month}`;
    let $ = yield pageLoader(url);

    $('.content .event h2 > a').each(function() {
      const href = $(this).attr('href');
      result.push(BASE_URL + href);
    });

    ++month;

    if (month > 12) {
      ++year;
      month = 1;
    }
  }

  return result;
});

exports.pageParser = co.wrap(function*(pageUrl) {
  const $ = yield pageLoader(pageUrl);
  const title = $('.content h2').html();
  const data = [];

  $('.details .info').each(function() {
    data.push($(this).html());
  });

  data.push($('.details .text').html());

  return { title, data };
});
