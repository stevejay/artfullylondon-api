'use strict';


const pageLoader = require('../../venue-processing/page-loader').staticLoader;

const BASE_URL = 'https://www.nationaltheatre.org.uk';

exports.pageFinder = async function() {
  const result = [];
  const $ = await pageLoader(`${BASE_URL}/whats-on`);
  const locations = ['Olivier Theatre', 'Lyttelton Theatre', 'Dorfman Theatre'];

  for (let i = 0; i < locations.length; ++i) {
    $(
      `section article a:has(p[itemprop='location']:contains('${locations[
        i
      ]}'))`
    ).each(function() {
      const href = $(this).attr('href');

      if (href.startsWith('/shows/')) {
        result.push(BASE_URL + href);
      }
    });
  }

  return result;
};

exports.pageParser = async function(pageUrl) {
  let $ = await pageLoader(pageUrl);
  const title = $('#maincontent h1').html();
  const data = [];

  $('#maincontent p').each(function() {
    data.push($(this).html());
  });

  let ticketPageUrl = $('a.prod-detail-btn').attr('href');

  if (ticketPageUrl) {
    if (!ticketPageUrl.startsWith('http')) {
      ticketPageUrl = BASE_URL + ticketPageUrl;
    }

    $ = await pageLoader(ticketPageUrl);
    data.push($('#maincontent header').html());
    data.push($('#wo-results-list').html());
  }

  return { title, data };
};
