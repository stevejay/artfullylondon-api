'use strict';

const sinon = require('sinon');
const expect = require('chai').expect;
const searchService = require('../../lib/services/search-service');
const msearch = require('../../lib/external-services/es-search');
const constants = require('../../lib/constants');

describe('search-service', () => {
  afterEach(() => {
    msearch.search.restore && msearch.search.restore();
  });

  describe('presetSearch', () => {
    it('should handle a valid request', done => {
      sinon.stub(msearch, 'search').callsFake(() => {
        const response = {
          responses: [
            {
              hits: {
                total: 33,
                hits: [{ _source: { id: '1' } }],
              },
            },
          ],
        };

        return Promise.resolve(response);
      });

      const request = {
        name: constants.FEATURED_EVENTS_SEARCH_PRESET,
      };

      searchService
        .presetSearch(request)
        .then(items => {
          expect(items).to.eql({
            items: [
              {
                id: '1',
              },
            ],
            params: {
              name: 'featured-events',
            },
          });

          done();
        })
        .catch(done);
    });
  });

  describe('eventAdvancedSearch', () => {
    it('should handle a valid public request', done => {
      sinon.stub(msearch, 'search').callsFake(() => {
        const response = {
          responses: [
            {
              hits: {
                total: 33,
                hits: [{ _source: { id: '1' } }],
              },
            },
          ],
        };

        return Promise.resolve(response);
      });

      const request = {
        term: 'foo',
        skip: 100,
        take: 50,
      };

      searchService
        .eventAdvancedSearch(request)
        .then(items => {
          expect(items).to.eql({
            items: [
              {
                id: '1',
              },
            ],
            params: {
              skip: 100,
              take: 50,
              term: 'foo',
              entityType: 'event',
              area: undefined,
              audience: undefined,
              booking: undefined,
              cost: undefined,
              dateFrom: undefined,
              dateTo: undefined,
              medium: undefined,
              style: undefined,
              talentId: undefined,
              timeFrom: undefined,
              timeTo: undefined,
              venueId: undefined,
            },
            total: 33,
          });
          done();
        })
        .catch(done);
    });
  });

  describe('basicSearch', () => {
    it('should handle a valid public request', done => {
      sinon.stub(msearch, 'search').callsFake(() => {
        const response = {
          responses: [
            {
              hits: {
                total: 33,
                hits: [{ _source: { id: '1' } }],
              },
            },
          ],
        };

        return Promise.resolve(response);
      });

      const request = {
        term: 'foo',
        entityType: 'venue',
        skip: 100,
        take: 50,
      };

      searchService
        .basicSearch(request, true)
        .then(items => {
          expect(items).to.eql({
            items: [
              {
                id: '1',
              },
            ],
            params: {
              entityType: 'venue',
              skip: 100,
              take: 50,
              term: 'foo',
            },
            total: 33,
          });
          done();
        })
        .catch(done);
    });

    it('should handle a valid admin request', done => {
      sinon.stub(msearch, 'search').callsFake(() => {
        const response = {
          responses: [
            {
              hits: {
                total: 33,
                hits: [{ _source: { id: '1' } }],
              },
            },
          ],
        };

        return Promise.resolve(response);
      });

      const request = {
        term: 'foo',
        entityType: 'venue',
        skip: 100,
        take: 50,
      };

      searchService
        .basicSearch(request, false)
        .then(items => {
          expect(items).to.eql({
            items: [
              {
                id: '1',
              },
            ],
            params: {
              entityType: 'venue',
              skip: 100,
              take: 50,
              term: 'foo',
            },
            total: 33,
          });
          done();
        })
        .catch(done);
    });

    it('should handle an invalid public request', done => {
      const request = {
        term: 'foo',
        entityType: 'unknown',
        skip: 100,
        take: 50,
      };

      searchService
        .basicSearch(request, true)
        .then(() => done(new Error('should have thrown an exception')))
        .catch(() => done());
    });
  });

  describe('autocompleteSearch', () => {
    it('should handle a valid request', done => {
      sinon.stub(msearch, 'search').callsFake(() => {
        const response = {
          responses: [
            {
              suggest: {
                autocomplete: [
                  {
                    options: [
                      {
                        text: 'Venue 1',
                        _source: {
                          id: 'venue-1',
                        },
                      },
                    ],
                  },
                ],
                fuzzyAutocomplete: [
                  {
                    options: [
                      {
                        text: 'Venue 2',
                        _source: {
                          id: 'venue-2',
                        },
                      },
                    ],
                  },
                ],
              },
            },
          ],
        };

        return Promise.resolve(response);
      });

      const request = {
        term: 'foo',
        entityType: 'venue',
        skip: 100,
        take: 50,
      };

      searchService
        .autocompleteSearch(request)
        .then(items => {
          expect(items).to.eql([
            {
              id: 'venue-1',
              name: 'Venue 1',
            },
            {
              id: 'venue-2',
              name: 'Venue 2',
            },
          ]);
          done();
        })
        .catch(done);
    });

    it('should handle an invalid request', done => {
      const request = {
        term: 'foo',
        entityType: 'unknown',
        skip: 100,
        take: 50,
      };

      searchService
        .autocompleteSearch(request)
        .then(() => done(new Error('should have thrown an exception')))
        .catch(() => done());
    });
  });
});
