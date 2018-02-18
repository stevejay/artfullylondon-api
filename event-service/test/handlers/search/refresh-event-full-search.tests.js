'use strict';

const sinon = require('sinon');
const searchIndexService = require('../../../lib/search/search-index-service');
const proxyHandlerRunner = require('../handler-runner');
const refreshEventFullSearch = require('../../../handlers/search/refresh-event-full-search');

describe('refresh-event-full-search', () => {
  afterEach(() => {
    searchIndexService.refreshEventFullSearch.restore();
  });

  it('should process a request', done => {
    sinon
      .stub(searchIndexService, 'refreshEventFullSearch')
      .callsFake(() => Promise.resolve());

    const expected = {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Credentials': true,
        'Access-Control-Allow-Origin': '*',
      },
      body: { acknowledged: true },
    };

    proxyHandlerRunner(refreshEventFullSearch.handler, null, expected, done);
  });
});
