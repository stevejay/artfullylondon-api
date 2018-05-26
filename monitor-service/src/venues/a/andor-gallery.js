'use strict';

const co = require('co');
const pageLoader = require('../../venue-processing/page-loader').staticLoader;

const BASE_URL = 'http://www.creativeandorcultural.com';

exports.pageFinder = co.wrap(function*() {
  const $ = yield pageLoader(BASE_URL);

  const exhibitionsParagraph = $('aside#sidebar-b p').filter(function() {
    return $(this).text().startsWith('EXHIBITIONS');
  });

  const result = [];

  exhibitionsParagraph.find('a').each(function() {
    const title = $(this).attr('title');
    if (!title) {
      return;
    }

    const href = $(this).attr('href');
    result.push(BASE_URL + href);
  });

  return result.slice(0, 5);
});

exports.pageParser = co.wrap(function*(pageUrl) {
  const $ = yield pageLoader(pageUrl);
  const title = $('title').html();

  if (title === '508 Resource Limit Is Reached') {
    throw new Error('Got error: 508 Resource Limit Is Reached');
  }

  const data = $('section#content article').html();
  return { title, data };
});

exports.venueOpenings = co.wrap(function*() {
  const $ = yield pageLoader(
    'http://www.creativeandorcultural.com/index.php/about-andor'
  );

  return $('#system article p')
    .html()
    .replace(
      /This email address is being protected from spambots\. You need JavaScript enabled to view it\./g,
      ''
    );
});
