'use strict';

const sinon = require('sinon');
const expect = require('chai').expect;
const handlerRunner = require('./handler-runner');
const eventAdvancedSearch = require('../../handlers/event-advanced-search');
const searchService = require('../../lib/services/search-service');

describe('event-advanced-search.handler', () => {
  afterEach(() => {
    searchService.eventAdvancedSearch.restore &&
      searchService.eventAdvancedSearch.restore();
  });

  it('should handle a valid event advanced search request', done => {
    sinon.stub(searchService, 'eventAdvancedSearch').callsFake(request => {
      expect(request).to.eql({
        term: 'bang',
      });

      return Promise.resolve({
        items: [
          {
            id: '1',
          },
        ],
        params: {
          skip: 100,
          take: 50,
          term: 'foo',
        },
        total: 33,
      });
    });

    const event = {
      queryStringParameters: {
        term: 'bang',
      },
      resource: '/public/foo',
    };

    const expected = {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Credentials': true,
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, max-age=1800',
      },
      body: {
        items: [
          {
            id: '1',
          },
        ],
        params: {
          skip: 100,
          take: 50,
          term: 'foo',
        },
        total: 33,
      },
    };

    handlerRunner(eventAdvancedSearch.handler, event, expected, done);
  });
});
