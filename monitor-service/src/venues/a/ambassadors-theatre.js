'use strict';

const pageLoader = require('../../venue-processing/page-loader').staticLoader;

const BASE_URL = 'https://www.theambassadorstheatre.co.uk';

exports.pageFinder = async function() {
  const $ = await pageLoader(BASE_URL + '/online/default.asp');
  const result = [];

  const pushHref = function() {
    let href = $(this).attr('href');

    if (href.startsWith('default.asp')) {
      href = BASE_URL + '/online/' + href;
    }

    result.push(href);
  };

  $('a:contains(\'BOOK NOW\')').each(pushHref);
  $('a:contains(\'Click here\')').each(pushHref);

  return result;
};

exports.pageParser = async function(pageUrl) {
  let title = null, data = null;

  if (pageUrl.includes('0F63FD1A-BB28-4C52-A93F-8EC066C26BFA')) {
    // get Stomp info.
    const $ = await pageLoader(
      'https://www.theambassadorstheatre.co.uk/online/default.asp'
    );

    title = $('title').html();
    data = $('#av_center table:first-of-type tbody').html();
  } else {
    const $ = await pageLoader(pageUrl);
    title = $('title').html();
    data = $('#main_table table').html();
  }

  return { title, data };
};
