'use strict';

const sinon = require('sinon');
const expect = require('chai').expect;
const searchIndexService = require('../../../lib/search/search-index-service');
const proxyHandlerRunner = require('../handler-runner');
const globalConstants = require('../../../lib/constants');
const refreshSearchIndex = require('../../../handlers/search/refresh-search-index');
const testData = require('../../test-data');

process.env.SERVERLESS_REFRESH_SEARCH_INDEX_TOPIC_ARN = 'refresh-search-index';

describe('refresh-search-index', () => {
  afterEach(() => {
    if (searchIndexService.refreshSearchIndex.restore) {
      searchIndexService.refreshSearchIndex.restore();
    }
  });

  it('should handle a request', done => {
    const event = {
      headers: testData.NORMAL_ADMIN_USER_REQUEST_HEADERS,
      pathParameters: {
        index: globalConstants.SEARCH_INDEX_TYPE_TALENT_FULL,
        version: 'latest',
      },
      query: {},
    };

    sinon.stub(searchIndexService, 'refreshSearchIndex').callsFake(request => {
      expect(request).to.eql({
        index: globalConstants.SEARCH_INDEX_TYPE_TALENT_FULL,
        version: 'latest',
      });

      return Promise.resolve();
    });

    const expected = {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Credentials': true,
        'Access-Control-Allow-Origin': '*',
      },
      body: { acknowledged: true },
    };

    proxyHandlerRunner(refreshSearchIndex.handler, event, expected, done);
  });
});
