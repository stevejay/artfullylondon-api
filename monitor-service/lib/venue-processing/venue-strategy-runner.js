'use strict';

const co = require('co');
const uniq = require('lodash.uniq');
const zip = require('lodash.zip');
const some = require('lodash.some');
const chunk = require('lodash.chunk');
const search = require('../external-services/search');
const id = require('./id');
const toText = require('./to-text');

const URL_REGEX = /^http/i;

exports.getVenueData = co.wrap(function*(venueStrategy) {
  let result = null;

  if (venueStrategy.venueOpenings) {
    const venueOpenings = yield venueStrategy.venueOpenings();
    result = { venueText: toText(venueOpenings) };
  }

  return result;
});

exports.discoverEvents = co.wrap(function*(venueId, venueStrategy) {
  const hasEventPages = !!venueStrategy.pageFinder;

  if (hasEventPages) {
    const pageFinderResult = yield venueStrategy.pageFinder();
    const pageUrls = uniq(pageFinderResult).map(url => (url || '').trim());

    if (some(pageUrls, url => !URL_REGEX.test(url))) {
      throw new Error(
        'one or more urls do not start with http: ' + JSON.stringify(pageUrls)
      );
    }

    const minimumExpectedEvents = venueStrategy.hasOwnProperty(
      'minimumExpectedEvents'
    )
      ? venueStrategy.minimumExpectedEvents
      : 1;

    if (pageUrls.length < minimumExpectedEvents) {
      throw new Error('Website HTML has probably changed');
    }

    let pageUrlChunks = chunk(pageUrls, venueStrategy.pageUrlChunks || 4);
    const parsedPages = [];

    for (let i = 0; i < pageUrlChunks.length; ++i) {
      const results = yield pageUrlChunks[i].map(pageUrl => {
        return new Promise((resolve, reject) => {
          venueStrategy.pageParser(pageUrl).then(resolve).catch(err => {
            err.eventId = pageUrl;
            reject(err);
          });
        });
      });

      Array.prototype.push.apply(parsedPages, results);
    }

    const externalEventIds = pageUrls.map(url =>
      id.createExternalEventId(venueId, url)
    );

    const artfullyEvents = yield search.findEvents(venueId, externalEventIds);

    return zip(
      externalEventIds,
      parsedPages,
      artfullyEvents,
      pageUrls
    ).map(tuple => {
      const externalEventId = tuple[0];
      let parsedPage = tuple[1];
      const artfullyEventId = tuple[2];
      const pageUrl = tuple[3];

      parsedPage = processParsePageResult(parsedPage);

      const result = {
        externalEventId: externalEventId,
        currentUrl: pageUrl,
        eventText: parsedPage.data || '[Empty]',
        inArtfully: !!artfullyEventId,
        combinedEvents: false,
      };

      if (parsedPage.title) {
        result.title = parsedPage.title;
      }

      if (artfullyEventId) {
        result.artfullyEventId = artfullyEventId;
      }

      return result;
    });
  } else {
    let parsedPage = yield venueStrategy.pageParser();
    parsedPage = processParsePageResult(parsedPage);
    const externalEventId = id.createExternalEventId(venueId);

    return [
      {
        externalEventId,
        title: 'Combined Events',
        eventText: parsedPage.data || '[Empty]',
        combinedEvents: true,
      },
    ];
  }
});

function processParsePageResult(parsedPage) {
  if (parsedPage) {
    if (parsedPage.hasOwnProperty('title') && !parsedPage.title) {
      delete parsedPage.title;
    } else {
      parsedPage.title = toText(parsedPage.title).replace(/\n/, ' ').trim();
    }

    if (parsedPage.hasOwnProperty('data') && !parsedPage.data) {
      delete parsedPage.data;
    } else {
      parsedPage.data = toText(parsedPage.data);
    }
  }

  return parsedPage;
}
