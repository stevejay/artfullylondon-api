'use strict';

const sinon = require('sinon');
const expect = require('chai').expect;
const searchIndexService = require('../../../lib/search/search-index-service');
const proxyHandlerRunner = require('../handler-runner');
const testData = require('../../test-data');
const updateEventSearchIndexSns = require('../../../handlers/search/update-event-search-index-sns');

process.env.SERVERLESS_REFRESH_SEARCH_INDEX_TOPIC_ARN = 'refresh-search-index';
process.env.SERVERLESS_VENUE_TABLE_NAME = 'venue-table';
process.env.SERVERLESS_EVENT_TABLE_NAME = 'event-table';

describe('update-event-search-index-sns', () => {
  afterEach(() => {
    if (searchIndexService.updateEventSearchIndex.restore) {
      searchIndexService.updateEventSearchIndex.restore();
    }
  });

  it('should update an event in the event search indexes', done => {
    const event = {
      Records: [
        {
          Sns: {
            Message: testData.PERFORMANCE_EVENT_ID,
          },
        },
      ],
    };

    sinon
      .stub(searchIndexService, 'updateEventSearchIndex')
      .callsFake(param => {
        expect(param).to.eql(testData.PERFORMANCE_EVENT_ID);
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

    proxyHandlerRunner(
      updateEventSearchIndexSns.handler,
      event,
      expected,
      done
    );
  });
});
