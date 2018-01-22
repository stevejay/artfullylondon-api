'use strict';

const sinon = require('sinon');
const expect = require('chai').expect;
const handlerRunner = require('./handler-runner');
const basicSearch = require('../../handlers/basic-search');
const searchService = require('../../lib/services/search-service');

describe('basic-search.handler', () => {
  afterEach(() => {
    searchService.basicSearch.restore && searchService.basicSearch.restore();
  });

  it('should handle a valid event basic search request', done => {
    sinon.stub(searchService, 'basicSearch').callsFake(request => {
      expect(request).to.eql({
        term: 'bang',
        entityType: 'event',
        skip: undefined,
        take: undefined,
        location: undefined,
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
      queryStringParameters: {
        term: 'bang',
        entityType: 'event',
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

    handlerRunner(basicSearch.handler, event, expected, done);
  });
});
