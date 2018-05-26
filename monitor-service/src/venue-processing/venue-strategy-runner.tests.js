'use strict';

const sinon = require('sinon');
const expect = require('chai').expect;
const search = require('../../lib/external-services/search');
const subject = require('../../lib/venue-processing/venue-strategy-runner');

describe('venue-strategy-runner', () => {
  describe('getVenueData', () => {
    it('should process a venue', done => {
      const venueStrategy = {
        venueOpenings: () => Promise.resolve(['description', 'foo']),
      };

      subject
        .getVenueData(venueStrategy)
        .then(result => {
          expect(result).toEqual({ venueText: 'description\n\nfoo' });
          done();
        })
        .catch(done);
    });
  });

  describe('discoverEvents', () => {
    afterEach(() => {
      if (search.findEvents.restore) {
        search.findEvents.restore();
      }
    });

    it('should process a venue with all events on one page', done => {
      const venueStrategy = {
        pageParser: () => Promise.resolve({ data: ['description', 'foo'] }),
      };

      subject
        .discoverEvents('almeida-theatre', venueStrategy)
        .then(result => {
          expect(result).toEqual([
            {
              title: 'Combined Events',
              externalEventId: 'almeida-theatre|/',
              eventText: 'description\n\nfoo',
              combinedEvents: true,
            },
          ]);

          done();
        })
        .catch(done);
    });

    it('should process a venue with all events on one page and empty data', done => {
      const venueStrategy = {
        pageParser: () => Promise.resolve({ data: [] }),
      };

      subject
        .discoverEvents('almeida-theatre', venueStrategy)
        .then(result => {
          expect(result).toEqual([
            {
              title: 'Combined Events',
              externalEventId: 'almeida-theatre|/',
              eventText: '[Empty]',
              combinedEvents: true,
            },
          ]);

          done();
        })
        .catch(done);
    });

    it('should process a venue with a separate page for each event', done => {
      const venueStrategy = {
        pageFinder: () =>
          Promise.resolve(['http://test.com/a', 'http://test.com/b']),
        pageParser: () =>
          Promise.resolve({
            title: '<p>Some<br/>Title</p>',
            data: '<p>description</p>',
          }),
      };

      const findEventsStub = sinon
        .stub(search, 'findEvents')
        .callsFake((venueId, externalEventIds) => {
          expect(venueId).toEqual('almeida-theatre');
          expect(externalEventIds).toEqual([
            'almeida-theatre|/a',
            'almeida-theatre|/b',
          ]);
          return Promise.resolve([null, 'artfully/id']);
        });

      subject
        .discoverEvents('almeida-theatre', venueStrategy)
        .then(result => {
          expect(result).toEqual([
            {
              title: 'Some Title',
              externalEventId: 'almeida-theatre|/a',
              currentUrl: 'http://test.com/a',
              eventText: 'description',
              inArtfully: false,
              combinedEvents: false,
            },
            {
              title: 'Some Title',
              externalEventId: 'almeida-theatre|/b',
              currentUrl: 'http://test.com/b',
              eventText: 'description',
              artfullyEventId: 'artfully/id',
              inArtfully: true,
              combinedEvents: false,
            },
          ]);

          expect(findEventsStub.called).toEqual(true);

          done();
        })
        .catch(done);
    });
  });
});
