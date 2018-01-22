'use strict';

const sinon = require('sinon');
const expect = require('chai').expect;
const handlerRunner = require('./handler-runner');
const autocompleteSearch = require('../../handlers/autocomplete-search');
const searchService = require('../../lib/services/search-service');

describe('autocomplete-search.handler', () => {
  afterEach(() => {
    searchService.autocompleteSearch.restore &&
      searchService.autocompleteSearch.restore();
  });

  it('should handle a valid event autocomplete search request', done => {
    sinon.stub(searchService, 'autocompleteSearch').callsFake(request => {
      expect(request).to.eql({
        term: 'bang',
        entityType: 'event',
      });

      return Promise.resolve([{ name: 'Id 2', id: 2 }]);
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
        params: {
          term: 'bang',
          entityType: 'event',
        },
        items: [{ name: 'Id 2', id: 2 }],
      },
    };

    handlerRunner(autocompleteSearch.handler, event, expected, done);
  });
});
