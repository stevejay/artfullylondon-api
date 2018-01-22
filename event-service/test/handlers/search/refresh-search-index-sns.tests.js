'use strict';

const sinon = require('sinon');
const expect = require('chai').expect;
const searchIndexService = require('../../../lib/services/search-index-service');
const globalConstants = require('../../../lib/constants');
const proxyHandlerRunner = require('../handler-runner');
const refreshSearchIndexSns = require('../../../handlers/search/refresh-search-index-sns');

describe('refresh-search-index-sns', () => {
  afterEach(() => {
    searchIndexService.processRefreshSearchIndexMessage.restore();
  });

  it('should process a request', done => {
    const event = {
      Records: [
        {
          Sns: {
            Message: JSON.stringify({
              index: globalConstants.SEARCH_INDEX_TYPE_TALENT_FULL,
              version: 10,
              entity: 'talent',
              exclusiveStartKey: null,
            }),
          },
        },
      ],
    };

    sinon
      .stub(searchIndexService, 'processRefreshSearchIndexMessage')
      .callsFake(param => {
        expect(param).to.eql({
          index: globalConstants.SEARCH_INDEX_TYPE_TALENT_FULL,
          version: 10,
          entity: 'talent',
          exclusiveStartKey: null,
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

    proxyHandlerRunner(refreshSearchIndexSns.handler, event, expected, done);
  });
});
