'use strict';

const sinon = require('sinon');
const expect = require('chai').expect;
const proxyHandlerRunner = require('../handler-runner');
const getEventSeriesForEdit = require('../../../handlers/event-series/get-event-series-for-edit');
const eventSeriesService = require('../../../lib/event-series/event-series-service');

describe('get-event-series-for-edit.handler', () => {
  afterEach(() => {
    eventSeriesService.getEventSeriesForEdit.restore();
  });

  it('should process get request', done => {
    const event = {
      pathParameters: {
        id: 'bang-said-the-gun',
      },
      headers: {},
      query: {},
    };

    sinon.stub(eventSeriesService, 'getEventSeriesForEdit').callsFake(id => {
      expect(id).to.eql('bang-said-the-gun');
      return Promise.resolve({ name: 'The Series' });
    });

    const expected = {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Credentials': true,
        'Access-Control-Allow-Origin': '*',
      },
      body: {
        entity: { name: 'The Series' },
      },
    };

    proxyHandlerRunner(getEventSeriesForEdit.handler, event, expected, done);
  });
});
