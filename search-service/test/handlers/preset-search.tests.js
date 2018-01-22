'use strict';

const sinon = require('sinon');
const expect = require('chai').expect;
const handlerRunner = require('./handler-runner');
const presetSearch = require('../../handlers/preset-search');
const searchService = require('../../lib/services/search-service');

describe('preset-search.handler', () => {
  afterEach(() => {
    searchService.presetSearch.restore && searchService.presetSearch.restore();
  });

  it('should handle a valid event preset search request', done => {
    sinon.stub(searchService, 'presetSearch').callsFake(request => {
      expect(request).to.eql({
        name: 'bang',
        id: null,
      });

      return Promise.resolve({
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
    });

    const event = {
      pathParameters: {
        name: 'bang',
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
          entityType: 'venue',
          skip: 100,
          take: 50,
          term: 'foo',
        },
        total: 33,
      },
    };

    handlerRunner(presetSearch.handler, event, expected, done);
  });
});
