'use strict';

const sinon = require('sinon');
const expect = require('chai').expect;
const proxyHandlerRunner = require('../handler-runner');
const testData = require('../../test-data');
const createOrUpdateEventSeries = require('../../../handlers/event-series/create-or-update-event-series');
const eventSeriesService = require('../../../lib/services/event-series-service');

describe('create-or-update-event-series.handler', () => {
  afterEach(() => {
    if (eventSeriesService.createOrUpdateEventSeries.restore) {
      eventSeriesService.createOrUpdateEventSeries.restore();
    }
  });

  it('should process create event series request', done => {
    const event = {
      headers: testData.NORMAL_ADMIN_USER_REQUEST_HEADERS,
      pathParameters: null,
      query: null,
      body: JSON.stringify({ name: 'New Name' }),
    };

    sinon
      .stub(eventSeriesService, 'createOrUpdateEventSeries')
      .callsFake((id, params) => {
        expect(id).to.eql(null);
        expect(params).to.eql({ name: 'New Name' });
        return Promise.resolve({ name: 'Saved Name' });
      });

    const expected = {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Credentials': true,
        'Access-Control-Allow-Origin': '*',
      },
      body: {
        entity: { name: 'Saved Name' },
      },
    };

    proxyHandlerRunner(
      createOrUpdateEventSeries.handler,
      event,
      expected,
      done
    );
  });

  it('should process update event series request', done => {
    const event = {
      headers: testData.NORMAL_ADMIN_USER_REQUEST_HEADERS,
      pathParameters: {
        id: testData.EVENT_SERIES_ID,
      },
      query: null,
      body: JSON.stringify({ name: 'New Name' }),
    };

    sinon
      .stub(eventSeriesService, 'createOrUpdateEventSeries')
      .callsFake((id, params) => {
        expect(id).to.eql(testData.EVENT_SERIES_ID);
        expect(params).to.eql({ name: 'New Name' });
        return Promise.resolve({ name: 'Saved Name' });
      });

    const expected = {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Credentials': true,
        'Access-Control-Allow-Origin': '*',
      },
      body: {
        entity: { name: 'Saved Name' },
      },
    };

    proxyHandlerRunner(
      createOrUpdateEventSeries.handler,
      event,
      expected,
      done
    );
  });
});
