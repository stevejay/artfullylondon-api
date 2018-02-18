'use strict';

const sinon = require('sinon');
const expect = require('chai').expect;
const proxyHandlerRunner = require('../handler-runner');
const testData = require('../../test-data');
const getEventSeries = require('../../../handlers/event-series/get-event-series');
const eventSeriesService = require('../../../lib/event-series/event-series-service');

describe('get-event-series.handler', () => {
  afterEach(() => {
    eventSeriesService.getEventSeries.restore();
  });

  it('should process an admin get event series request', done => {
    const event = {
      pathParameters: {
        id: testData.EVENT_SERIES_ID,
      },
      headers: {},
      resource: '/admin/foo',
      query: {},
    };

    sinon
      .stub(eventSeriesService, 'getEventSeries')
      .callsFake((id) => {
        expect(id).to.eql(testData.EVENT_SERIES_ID);
        return Promise.resolve({ name: 'The Series' });
      });

    const expected = {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Credentials': true,
        'Access-Control-Allow-Origin': '*',
        'X-Artfully-Cache': 'Miss',
      },
      body: {
        entity: { name: 'The Series' },
      },
    };

    proxyHandlerRunner(getEventSeries.handler, event, expected, done);
  });

  it('should process a public get event series request', done => {
    const event = {
      pathParameters: {
        id: testData.EVENT_SERIES_ID,
      },
      headers: {},
      resource: '/public/foo',
      query: {},
    };

    sinon
      .stub(eventSeriesService, 'getEventSeries')
      .callsFake((id) => {
        expect(id).to.eql(testData.EVENT_SERIES_ID);
        return Promise.resolve({ name: 'The Series' });
      });

    const expected = {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Credentials': true,
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, max-age=1800',
        ETag: '"20-qL1VLd0w2ffC4Y2EyiZOSLw/92c"',
        'X-Artfully-Cache': 'Miss',
      },
      body: {
        entity: { name: 'The Series' },
      },
    };

    proxyHandlerRunner(getEventSeries.handler, event, expected, done);
  });
});
